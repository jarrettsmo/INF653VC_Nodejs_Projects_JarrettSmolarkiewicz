const fs = require('fs');

const rs = fs.createReadStream('./files/lorem.txt', { encoding: 'utf8' });

const ws = fs.createWriteStream('./files/new_lorem.txt');

// 1st way 
// rs.on('data', (dataChunk) => {
//     ws.write(dataChunk);
// });

// "Piping" 2nd much more efficient way to do the exact same thing!
rs.pipe(ws);