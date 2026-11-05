import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9228',
  '--headless=new',
  '--window-size=1440,900',
  '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-debug-profile-6',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:9228/json');
    const tabs = await r.json();
    const tab = tabs.find(t => t.url.includes('3000'));
    const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));

      // 1. Capture Full Viewport Hero
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 2000);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.id === 10 && msg.result?.data) {
        fs.writeFileSync('C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\render-hero-full-viewport.png', Buffer.from(msg.result.data, 'base64'));
        console.log('SAVED: render-hero-full-viewport.png');

        // 2. Click Services tab in navbar
        ws.send(JSON.stringify({
          id: 20,
          method: 'Runtime.evaluate',
          params: { expression: 'Array.from(document.querySelectorAll("header nav button")).find(b => b.textContent.includes("Services"))?.click()' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 30, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1200);
      }

      if (msg.id === 30 && msg.result?.data) {
        fs.writeFileSync('C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\render-services-redesign.png', Buffer.from(msg.result.data, 'base64'));
        console.log('SAVED: render-services-redesign.png');

        // 3. Click About tab in navbar
        ws.send(JSON.stringify({
          id: 40,
          method: 'Runtime.evaluate',
          params: { expression: 'Array.from(document.querySelectorAll("header nav button")).find(b => b.textContent.includes("About"))?.click()' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 50, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1200);
      }

      if (msg.id === 50 && msg.result?.data) {
        fs.writeFileSync('C:\\Users\\Ansh\\.gemini\\antigravity\\brain\\ffeb696b-8156-4061-bb14-1f67fe2d1992\\render-about-redesign.png', Buffer.from(msg.result.data, 'base64'));
        console.log('SAVED: render-about-redesign.png');
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
