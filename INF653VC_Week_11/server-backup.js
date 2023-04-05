// https://github.com/gitdagray/nodejs_web_server

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {};
// initialize object
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes('image') ? 'utf-8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    /**
     * A Ternary Operator in Javascript is a special operator which accepts three operands. 
     * It is also known as the "conditional" or "inline-if" operator. 
     * Ternary Operator in JavaScript makes our code clean and simpler. 
     * It can be chained like an if-else if....else if-else block.
     */

    // "Chain" ternary statement
    // 1st, we want to set the value of the file path using this chain ternary statement.
    // The result of the statement will be saved in the "let" variable "filepath" 
    let filePath = 
        // IF the content type (contentType) is html (text/html) AND (&&) the request URL (req.url) is just a slash (/), 
        contentType === 'text/html' && req.url === '/'
            // THEN (?) path.join(__dirname, 'views', 'index.html') will be the value (set the path name using the "views" directory).
            ? path.join(__dirname, 'views', 'index.html')
            // IF the previous IF statement doesn't match, BUT this IF statement does use the IF statement below...
            // IF content type (contentType) is html (text/html) AND (&&) the LAST CHARACTER (.slice(-1)) 
            // of the request URL (req.url) is a slash (/),
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                // THEN (?) we are likely dealing with a SUBDIRECTORY, so use the THEN statement below...
                // THEN (?) path.join(__dirname, 'views', ALONG WITH THE req.url, 'index.html') will be the stored value "filepath".
                ? path.join(__dirname, 'views', req.url, 'index.html')
                // IF neither of the previous IF statements match, BUT this IF statement does use the IF statement below...
                // IF content type (contentType) is AT LEAST html (text/html), 
                : contentType === 'text/html'
                    // THEN (?) we just look at WHATEVER was requested in the 'views' FOLDER because that is where it should be.
                    ? path.join(__dirname, 'views', req.url)
                    // HOWEVER--IF that's not the case, then we're just going to use the directory name and the request URL...
                    // Because this could be CSS, or an image, or something in one of the other folders that would be specified in
                    // the request URL (req.url).
                    : path.join(__dirname, req.url);
    /**
     * SUMMARY OF ABOVE STATEMENT...
     * Another way to look at the chain ternary statement above, is:
     * 
     * Whatever line starts with (contentType) is a CONDITION
     * and whatever starts with (?) is what will happen if that condition is TRUE
     * and the last line starting (: path) is the DEFAULT if none of the above conditions are true. 
     * 
     */

    // Makes the ".html" NOT REQUIRED in the browser.
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // serve the file
        serveFile(filePath, contentType, res);
    } else {
        // 404
        // 301 Redirect
        switch(path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                // server a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);

        }
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// add listener for the log event
// myEmitter.on('log', (msg) => logEvents(msg));

//     myEmitter.emit('log', 'Log event emitted!');