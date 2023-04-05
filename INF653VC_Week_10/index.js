const fs = require('fs');
// const fsPromises = require('fs').promises;
const path = require('path');

// Node.js efficient way to perform all operations below and avoid callback hell...
const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');
        console.log(data);
        await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt'));
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you.');
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf8');
        console.log(newData);
    } catch (err) {
        console.error(err);
    }
}

fileOps();

// fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data) => {
// // fs.readFile('./files/starter.txt'), 'utf8', (err, data) => { // Hard-coded file path is not as good as using "path" approach above...
//     if (err) throw err;
//     // console.log(data.toString()); // Read contents of file without 'utf8' parameter in readFile()
//     console.log(data); // Read contents of file with 'utf8'
// });

// // Logs to console first by Node.js due to asynchronous JavaScript                           // <<<<<<<<<< ********** SUPER IMPORTANT !!!! **********
// console.log('Hello...');

// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you.', (err) => {
//     if (err) throw err;
//     // console.log(data.toString()); // Read contents of file without 'utf8' parameter in readFile()
//     console.log('Write complete'); // 'utf8' is default for this and not needed above
    
//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\nYes it is.', (err) => {
//         if (err) throw err;
//         // console.log(data.toString()); // Read contents of file without 'utf8' parameter in readFile()
//         console.log('Append complete'); // 'utf8' is default for this and not needed above
        
//         fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'), (err) => {
//             if (err) throw err;
//             // console.log(data.toString()); // Read contents of file without 'utf8' parameter in readFile()
//             console.log('Rename complete'); // 'utf8' is default for this and not needed above
//         });

//     });

// });

// exit on uncaught errors using "process" which is available through Node.js
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})