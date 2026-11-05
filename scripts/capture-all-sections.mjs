import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9224',
  '--headless=new',
  '--window-size=1440,900',
  '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-debug-profile-3',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:9224/json');
    const tabs = await r.json();
    const tab = tabs.find(t => t.url.includes('3000'));
    const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);

    let step = 1;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));

      // Capture Hero (top)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 2000);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 10 && msg.result?.data) {
        fs.writeFileSync('C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\render-01-hero.png', Buffer.from(msg.result.data, 'base64'));
        console.log('SAVED: render-01-hero.png');

        // Scroll to Bento
        ws.send(JSON.stringify({
          id: 20,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("section-bento")?.scrollIntoView({ behavior: "instant" })' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 30, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1000);
      }

      if (msg.id === 30 && msg.result?.data) {
        fs.writeFileSync('C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\render-02-bento.png', Buffer.from(msg.result.data, 'base64'));
        console.log('SAVED: render-02-bento.png');

        // Scroll to Community
        ws.send(JSON.stringify({
          id: 40,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("section-community")?.scrollIntoView({ behavior: "instant" })' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 50, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1000);
      }

      if (msg.id === 50 && msg.result?.data) {
        fs.writeFileSync('C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\render-03-community.png', Buffer.from(msg.result.data, 'base64'));
        console.log('SAVED: render-03-community.png');
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
