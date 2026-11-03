import { spawn } from 'child_process';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const outFile = process.argv[3] || 'screenshot.png';
const action = process.argv[4] || '';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=9333',
  '--headless=new',
  '--window-size=1440,900',
  '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-profile-temp',
  url
]);

setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:9333/json');
    const tabs = await r.json();
    const tab = tabs.find(t => t.url.includes('3000'));
    const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));

      if (action) {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 2,
            method: 'Runtime.evaluate',
            params: { expression: action }
          }));
        }, 1000);
      }

      setTimeout(() => {
        ws.send(JSON.stringify({ id: 3, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, action ? 2200 : 1500);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 3 && msg.result?.data) {
        fs.writeFileSync(outFile, Buffer.from(msg.result.data, 'base64'));
        console.log('CAPTURED_OK:', outFile);
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error('ERROR:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
