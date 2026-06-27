const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const startMarker = 'function showDetails(id) {';
const endMarker = 'let mapInstance = null;';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

const funcCode = content.substring(startIdx, endIdx);

// Count backticks in different sections
const lines = funcCode.split('\n');
lines.forEach((line, i) => {
  const count = (line.match(/`/g) || []).length;
  if (count > 0) {
    console.log(`Line ${i}: ${count} backticks - ${line.trim().substring(0, 80)}`);
  }
});
