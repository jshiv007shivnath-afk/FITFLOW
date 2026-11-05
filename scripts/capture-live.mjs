import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9223',
  '--headless=new',
  '--window-size=1440,2400',
  '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-debug-profile-2',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:9223/json');
    const tabs = await r.json();
    const tab = tabs.find(t => t.url.includes('3000'));
    const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      // Set viewport
      ws.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: {
          width: 1440,
          height: 2400,
          deviceScaleFactor: 1,
          mobile: false
        }
      }));

      // Wait a moment then capture screenshot
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 2500);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 2 && msg.result?.data) {
        const buf = Buffer.from(msg.result.data, 'base64');
        const outPath = 'C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\unslop-master-spec-render.png';
        fs.writeFileSync(outPath, buf);
        console.log('SCREENSHOT_SAVED:', outPath, 'Bytes:', buf.length);
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
