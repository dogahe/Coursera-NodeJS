const express = require('express'),
    http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');


var createError = require('http-error');
var cookieParser = require('cookie-parser');


const hostname = 'localhost';
const port = 3000;

const app = express();

app.use(morgan('dev'));

function auth(req, res, next) {
    console.log(req.headers);
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!')

        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);

    } 

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':')
    var username = auth[0]
    var password = auth[1]

    if (username === 'admin' && password === 'password') {
        next();
    } else {
        var err = new Error('You are not authenticated!')

        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
}

app.use(auth);

app.use(express.static(__dirname + '/public'));

/*
app.use((req, res, next) => {
    console.log("******")
    console.log(__dirname)
    console.log("******")
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});
*/

app.use(bodyParser.json());

const dishRouter = require('./routes/dishRouter');



app.use('/dishes', dishRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});