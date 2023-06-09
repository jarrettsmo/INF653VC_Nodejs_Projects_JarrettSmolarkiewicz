// https://github.com/gitdagray/nodejs_web_server
// https://www.youtube.com/watch?v=jivyItmsu18&list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw&index=6 

const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

// Middleware is ANYTHING between the request and the response. 
// There are 3 kinds of Middleware:
// 1) Built-in Middleware
// 2) Custom Middleware
// 3) Third-Party Middleware

// Built-in Middleware for express.js
// app.use() is typically used to apply Middleware to ALL routes that are coming in.
app.use(express.urlencoded({ extended: false }));

// Built-in Middleware for json
// Additional layer of Middleware...
app.use(express.json());

// Server static files (like images, etc that should be available to the public - put in "public" folder)
// Additional piece of Middleware...
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    // res.send('Hello World!');
    // res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    // This is a route handler
    res.redirect(301, '/new-page.html'); // Response code 302 by default. We want 301.
});

// Route handlers (one way functions get chained together)
// app.get('/hello(.html)?', (req, res, next) => {
//     console.log('attempted to load hello.html');
//     next()
// }, (req, res) => {
//     res.send('Hello World!');
// })

// More common way of chaining route handlers (functions chained together)
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

// Last function DOES NOT HAVE next, and includes res.send();
const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

// Route handlers work like "Middleware"
app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));