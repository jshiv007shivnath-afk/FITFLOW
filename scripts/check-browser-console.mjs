import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9222',
  '--headless=new',
  '--window-size=1440,900',
  '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-debug-profile',
  'about:blank'
]);

setTimeout(async () => {
  const r = await fetch('http://localhost:9222/json');
  const tabs = await r.json();
  const tab = tabs.find(t => t.type === 'page');
  const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
    ws.send(JSON.stringify({ id: 2, method: 'Page.navigate', params: { url: 'http://localhost:3000' } }));
  };
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Page.loadEventFired') {
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 3, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 2000);
    }
    if (msg.id === 3 && msg.result && msg.result.data) {
      fs.writeFileSync('C:\\Users\\Ansh\\.antigravity\\fitflow\\current-render-desktop.png', Buffer.from(msg.result.data, 'base64'));
      console.log('SUCCESS: current-render-desktop.png saved!');
      ws.close();
      chrome.kill();
      process.exit(0);
    }
  };
}, 1500);
