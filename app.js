require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));
console.log(package.name + ' ' + package.version);
const { createClient } = require('redis');
app.use(cors());


const http = require('http');
const server = http.createServer(app);
const morgan = require('morgan');
const maxAge = process.env.NODE_ENV == 'production' ? 10800 : 1;
console.log("mode = " + process.env.NODE_ENV);
const MORGAN_FORMAT = process.env.MORGAN_FORMAT || 'dev';
app.use(morgan(MORGAN_FORMAT));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser())


app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname + '/public/', 'favicon.ico')));
app.use("/asset/js/", express.static(path.join(__dirname + '/public/js/'), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=' + maxAge);
        res.set('ETag', package.version); // add etag
    }
}));
app.use("/asset/img/", express.static(path.join(__dirname + '/public/img/'), {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=86400');
        res.set('ETag', package.version); // add etag
    }
}));
app.use("/asset/css/", express.static(path.join(__dirname + '/public/css/'),
    {
        setHeaders: (res, path, stat) => {
            res.set('Cache-Control', 'public, max-age=' + maxAge);
            res.set('ETag', package.version); // add etag
        }
    }));
app.use("/asset/site.webmanifest", express.static(path.join(__dirname + '/public/site.webmanifest')))
app.use("/asset/favicon.ico", express.static(path.join(__dirname + '/public/favicon.ico')))


const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_URL_PORT
    }
});
client.connect();
client.on('connect', () => {
    console.log('Redis client connected');
});
client.on('error', (err) => {
    console.log('Something went wrong ' + err);
});

app.use((req, res, next) => {
    req.cache = client;
    next();
});

const routes = require('./routes');
app.use('/', routes);

const routeRest = require('./routes/rest');
app.use('/rest', routeRest);

const hardin = require('./routes/hardin');
app.use('/rest/hardin', hardin);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});