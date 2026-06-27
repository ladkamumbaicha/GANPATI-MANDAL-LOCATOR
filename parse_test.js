const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find showDetails function boundaries
const startMarker = 'function showDetails(id) {';
const endMarker = 'let mapInstance = null;';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

console.log('Function starts at:', startIdx);
console.log('Function ends at:', endIdx);

const funcCode = content.substring(startIdx, endIdx);

// Check for backtick balance
const backtickCount = (funcCode.match(/`/g) || []).length;
console.log('Backtick count:', backtickCount);
console.log('Is even:', backtickCount % 2 === 0);

// Try to parse as script
try {
  const script = content.substring(content.indexOf('<script>'), content.indexOf('</script>'));
  new Function(script);
  console.log('Script parses OK');
} catch (e) {
  console.log('Script parse error:', e.message);
}
