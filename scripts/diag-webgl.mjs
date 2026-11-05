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
          const el = document.elementFromPoint(15, 100);
          const canvas = document.querySelector('canvas.gradient-ascii-canvas');
          let glError = null;
          let webglSupported = false;
          if (canvas) {
            try {
              const testGl = canvas.getContext('webgl2');
              webglSupported = !!testGl;
              if (testGl) glError = testGl.getError();
            } catch (e) {
              glError = e.message;
            }
          }
          return {
            elementFromPoint: el ? { tag: el.tagName, class: el.className, outer: el.outerHTML.slice(0, 200) } : null,
            canvasFound: !!canvas,
            webglSupported,
            glError,
            windowInnerWidth: window.innerWidth,
            windowInnerHeight: window.innerHeight,
          };
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('WEBGL & DOM DIAGNOSTIC:', JSON.stringify(msg.result.result.value, null, 2));
      chrome.kill();
      process.exit(0);
    }
  };
}, 1500);
