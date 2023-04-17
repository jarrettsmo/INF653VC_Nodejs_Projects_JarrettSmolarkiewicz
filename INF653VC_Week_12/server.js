require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom Middleware logger to see requests for EVERYTHING as it comes through (must be at the top of all other Middleware functions)...
app.use(logger);

// CORS Options Controller
app.use(cors(corsOptions));

// Built-in Middleware for express.js
app.use(express.urlencoded({ extended: false }));

// Built-in Middleware for json
app.use(express.json());

// Server static files (like images, etc that should be available to the public - put in "Public" folder)
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));

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

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});