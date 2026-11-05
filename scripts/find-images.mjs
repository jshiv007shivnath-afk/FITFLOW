import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, ['--remote-debugging-port=9222', '--headless=new', '--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-debug-profile', 'http://localhost:3000']);
setTimeout(async () => {
  const r = await fetch('http://localhost:9222/json');
  const tabs = await r.json();
  const tab = tabs.find(t => t.url.includes('3000'));
  const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          return Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            rect: img.getBoundingClientRect()
          }));
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('IMAGES ON PAGE:', JSON.stringify(msg.result.result.value, null, 2));
      chrome.kill();
      process.exit(0);
    }
  };
}, 1500);
