import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const screens = [
  { url: 'http://localhost:3000/stitch_screens/home.html', file: 'screen_home.png', title: 'FitFlow Dashboard' },
  { url: 'http://localhost:3000/stitch_screens/progress.html', file: 'screen_progress.png', title: 'Telemetry & Progress' },
  { url: 'http://localhost:3000/stitch_screens/rewards.html', file: 'screen_rewards.png', title: 'Habits & Streaks' },
  { url: 'http://localhost:3000/stitch_screens/profile.html', file: 'screen_profile.png', title: 'Recovery & Biometrics' },
  { url: 'http://localhost:3000/stitch_screens/add.html', file: 'screen_add.png', title: 'Workout Session Logger' },
  { url: 'http://localhost:3000/stitch_screens/login.html', file: 'screen_login.png', title: 'Secure Athlete Login' },
];

const outDir = 'C:\\Users\\Ansh\\.antigravity\\fitflow\\public\\screens';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureScreen({ url, file }) {
  return new Promise((resolve, reject) => {
    const port = 9444 + Math.floor(Math.random() * 100);
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      `--remote-debugging-port=${port}`,
      '--headless=new',
      '--window-size=500,880',
      `--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-temp-${port}`,
      url
    ]);

    const timer = setTimeout(() => {
      chrome.kill();
      reject(new Error(`Timeout capturing ${file}`));
    }, 15000);

    setTimeout(async () => {
      try {
        const r = await fetch(`http://localhost:${port}/json`);
        const tabs = await r.json();
        const tab = tabs.find(t => t.url.includes(url) || t.url.includes('stitch_screens'));
        if (!tab) {
          throw new Error('Tab not found');
        }

        const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 480, height: 860, deviceScaleFactor: 2, mobile: true }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png', captureBeyondViewport: false }
            }));
          }, 1500);
        };

        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === 2 && msg.result?.data) {
            const outPath = path.join(outDir, file);
            fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
            console.log(`Captured ${file} (${outPath})`);
            clearTimeout(timer);
            chrome.kill();
            resolve();
          }
        };

        ws.onerror = (err) => {
          clearTimeout(timer);
          chrome.kill();
          reject(err);
        };
      } catch (err) {
        clearTimeout(timer);
        chrome.kill();
        reject(err);
      }
    }, 2000);
  });
}

async function run() {
  for (const s of screens) {
    try {
      await captureScreen(s);
    } catch (e) {
      console.error(`Failed ${s.file}:`, e.message);
    }
  }
  console.log('ALL DONE');
  process.exit(0);
}

run();
