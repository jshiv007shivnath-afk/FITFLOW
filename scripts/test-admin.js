const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Testing /api/admin/stats...');
  const s = await get('/api/admin/stats');
  console.log('Status:', s.status, 'Body:', JSON.stringify(s.json || s.text, null, 2));

  console.log('\nTesting /api/admin/users...');
  const u = await get('/api/admin/users');
  console.log('Status:', u.status, 'Body:', JSON.stringify(u.json || u.text, null, 2));
}

main().catch(console.error);
