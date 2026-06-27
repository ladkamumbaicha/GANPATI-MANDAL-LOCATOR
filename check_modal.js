const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const idx = c.indexOf('modalBody.innerHTML');
console.log('Found at:', idx);
console.log('Context:', c.substring(idx - 20, idx + 300));
