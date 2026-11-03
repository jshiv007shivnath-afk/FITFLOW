import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9226',
  '--headless=new',
  '--window-size=1440,900',
  '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-debug-profile-5',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:9226/json');
    const tabs = await r.json();
    const tab = tabs.find(t => t.url.includes('3000'));
    const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));

      // Scroll down to scroll-expand section
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: { expression: 'window.scrollTo(0, 800)' }
        }));
      }, 1000);

      setTimeout(() => {
        ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 2500);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 20 && msg.result?.data) {
        const outPath = 'C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\render-scroll-white.png';
        fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
        console.log('SAVED:', outPath);
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
