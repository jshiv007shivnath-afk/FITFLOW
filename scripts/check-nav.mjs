import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, ['--remote-debugging-port=9227', '--headless=new', 'http://localhost:3000']);

setTimeout(async () => {
  const r = await fetch('http://localhost:9227/json');
  const tabs = await r.json();
  const tab = tabs.find(t => t.url.includes('3000'));
  const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const el = document.querySelector('header > div');
          return {
            className: el ? el.className : null,
            computedBg: el ? window.getComputedStyle(el).backgroundColor : null,
            computedColor: el ? window.getComputedStyle(el).color : null
          };
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('NAVBAR COMPUTED:', msg.result.result.value);
      chrome.kill();
      process.exit(0);
    }
  };
}, 2000);
