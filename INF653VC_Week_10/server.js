// Differences between NodeJS and Vanilla JS
// 1) Node runs on a server (Backend) - not in browser like Vanilla JavaScript (Frontend)

// 2) The console is the terminal window NOT the browser dev tools
// console.log("Cheerio World!");

// 3) Node.js uses the global object vs. the window object
// console.log(global);

// 4) Node.js has Common Core modules

// 5) To import Common Core modules, we use CommonJS modules vs. ES6 modules
// (CommonJS uses a require statement)

// 6) Node.js is missing some APIs available in Vanilla JavaScript (like "fetch")
// (we can always pull in packages through Node Package Manager (npm) to help make up for this)
const os = require("os");
const path = require("path");

// 1st way to import math.js (all exported modules)
// const math = require("./math");

//     console.log(math.add(2, 3));
//     console.log(math.subtract(2, 3));
//     console.log(math.multiply(2, 3));
//     console.log(math.divide(2, 3));

// 2nd way to import math.js (just "add" exported module)
// const { add } = require("./math");

//     console.log(add(2, 3));

// 2nd way to import math.js (with all exported modules)
const { add, subtract, multiply, divide } = require("./math");

    console.log(add(2, 3));
    console.log(subtract(2, 3));
    console.log(multiply(2, 3));
    console.log(divide(2, 3));

    // // Darwin
    // console.log(os.type());

    // // Darwin Kernel Version 22.3.0: Mon Jan 30 20:38:43 PST 2023; root:xnu-8792.81.3~2/RELEASE_ARM64_T8112
    // console.log(os.version());

    // // /Users/jsep
    // console.log(os.homedir());

    // // /Users/jsep/Desktop/INF653VC/Nodejs_Projects/INF653VC_Week_10
    // console.log(__dirname);

    // // /Users/jsep/Desktop/INF653VC/Nodejs_Projects/INF653VC_Week_10/server.js
    // console.log(__filename);

    // // /Users/jsep/Desktop/INF653VC/Nodejs_Projects/INF653VC_Week_10
    // console.log(path.dirname(__filename));

    // // server.js
    // console.log(path.basename(__filename));

    // // .js
    // console.log(path.extname(__filename));

    // /* GET IT ALL WITH: path.parse(__filename)
    //     {
    //         root: '/',
    //         dir: '/Users/jsep/Desktop/INF653VC/Nodejs_Projects/INF653VC_Week_10',
    //         base: 'server.js',
    //         ext: '.js',
    //         name: 'server'
    //     }
    // */
    // console.log(path.parse(__filename));