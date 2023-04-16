// https://github.com/gitdagray/nodejs_web_server
// https://www.youtube.com/watch?v=y18ubz7gOsQ&list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw&index=7 
// https://github.com/jarrettsmo/INF653VC_Nodejs_Projects_JarrettSmolarkiewicz

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// Middleware is ANYTHING between the request and the response. 
// There are 3 kinds of Middleware:
// 1) Built-in Middleware
// 2) Custom Middleware
// 3) Third-Party Middleware

// Custom Middleware logger to see requests for EVERYTHING as it comes through (must be at the top of all other Middleware functions)...
app.use(logger);

// CORS stands for Cross Origin Resource Sharing
const whitelist = [/*'https://www.google.com', */'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        // Don't forget to remove local URL's and !origin AFTER development!!!  
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Built-in Middleware for express.js
// app.use() is typically used to apply Middleware to ALL routes that are coming in.
app.use(express.urlencoded({ extended: false }));

// Built-in Middleware for json
// Additional layer of Middleware...
app.use(express.json());

// Server static files (like images, etc that should be available to the public - put in "Public" folder)
// Additional piece of Middleware...
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// app.use('^/$', require('')); Tells it that request MUST start and end with slash using Regex
// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));

// Moved to root.js file
// app.get('^/$|/index(.html)?', (req, res) => {
//     // res.send('Hello World!');
//     // res.sendFile('./views/index.html', { root: __dirname });
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/new-page(.html)?', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
// });

// app.get('/old-page(.html)?', (req, res) => {
//     // This is a route handler
//     res.redirect(301, '/new-page.html'); // Response code 302 by default. We want 301.
// });

// Route handlers (one way functions get chained together)
// app.get('/hello(.html)?', (req, res, next) => {
//     console.log('attempted to load hello.html');
//     next()
// }, (req, res) => {
//     res.send('Hello World!');
// })

// // More common way of chaining route handlers (functions chained together)
// const one = (req, res, next) => {
//     console.log('one');
//     next();
// }

// const two = (req, res, next) => {
//     console.log('two');
//     next();
// }

// // Last function DOES NOT HAVE next, and includes res.send();
// const three = (req, res) => {
//     console.log('three');
//     res.send('Finished!');
// }

// // Route handlers work like "Middleware"
// app.get('/chain(.html)?', [one, two, three]);

// app.use('/') - BE CAREFUL! app.use() is for Middleware and DOES NOT accept Regex!!! 
// (in older versions of Express.js - newer versions of Express.js DO accept Regex)
// app.get('/*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });
// app.all() is for Routing and accepts Regex.
app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Function with error logging parameter - also displays message in browser.
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));