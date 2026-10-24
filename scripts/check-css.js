const http = require('http');

http.get('http://localhost:3000', (res) => {
  let html = '';
  res.on('data', (chunk) => (html += chunk));
  res.on('end', () => {
    const match = html.match(/\/(_next\/static\/css\/[^"]+)/);
    console.log('CSS URL in HTML:', match ? match[0] : 'NONE');
    if (match) {
      http.get('http://localhost:3000' + match[0], (cssRes) => {
        console.log('CSS Status Code:', cssRes.statusCode);
        let css = '';
        cssRes.on('data', (c) => (css += c));
        cssRes.on('end', () => {
          console.log('CSS Content Length:', css.length);
          console.log('CSS Preview:', css.slice(0, 150));
        });
      });
    }
  });
});
