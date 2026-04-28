const fs = require('fs');
const dir = String.fromCharCode(67, 58, 92, 85, 115, 101, 114, 115, 92, 109, 52, 117, 108, 97, 110, 97, 115, 104, 92, 46, 103, 101, 109, 105, 110, 105, 92, 97, 110, 116, 105, 103, 114, 97, 118, 105, 116, 121, 92, 98, 114, 97, 105, 110, 92, 99, 102, 56, 51, 101, 49, 51, 97, 45, 55, 52, 48, 49, 45, 52, 97, 51, 50, 45, 97, 54, 54, 101, 45, 97, 55, 57, 49, 54, 50, 54, 50, 99, 57, 49, 49);
const files = fs.readdirSync(dir).filter(f => f.startsWith('media__') && f.endsWith('.png') || f.endsWith('.jpg')).sort();
const latestFile = files[files.length - 1];
console.log("Copying", latestFile);
fs.copyFileSync(dir + '\\' + latestFile, 'public/rektorat-ipb.png');
console.log("Done");
