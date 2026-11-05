import { spawn } from 'child_process';
import fs from 'fs';

const page = process.argv[2] || 'services';
const outPath = process.argv[3] || 'screenshot.png';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=9229',
  '--headless=new',
  '--window-size=1440,1100',
  '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-profile-capture-' + page,
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:9229/json');
    const tabs = await r.json();
    const tab = tabs.find(t => t.url.includes('3000'));
    const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false }
      }));

      // Click the tab button
      setTimeout(() => {
        const textTarget = page === 'services' ? 'Services' : 'About';
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const btns = Array.from(document.querySelectorAll('header nav button'));
              const target = btns.find(b => b.textContent.includes('${textTarget}'));
              if (target) { target.click(); return true; }
              return false;
            })()`
          }
        }));
      }, 1500);

      // Capture screenshot after animation settles
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 3500);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 3 && msg.result?.data) {
        fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
        console.log('SUCCESS_CAPTURED:', outPath);
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error('ERROR:', err);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
