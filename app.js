require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const useragent = require('express-useragent');
// const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));
console.log(package.name + ' ' + package.version);
const { createClient } = require('redis');
// app.use(cors());

app.use(useragent.express());

const http = require('http');
const server = http.createServer(app);
console.log("mode = " + process.env.NODE_ENV);
// Buat token custom untuk IP dari header `x-real-ip`
morgan.token('real-ip', (req) => req.headers['x-real-ip'] || req.ip);
// 2. Buat custom token bernama :device
morgan.token('device', (req) => {
    if (req.useragent) {
        if (req.useragent.isMobile) return 'Mobile';
        if (req.useragent.isTablet) return 'Tablet';
        if (req.useragent.isDesktop) return 'Desktop';
        if (req.useragent.isBot) return 'Bot';
    }
    return 'Unknown-Device';
});
// Format custom: IP + method + url + status + response-time
const customFormat = ':real-ip :device :method  :url :status :response-time ms';
app.use(morgan(customFormat));
// app.use(morgan(MORGAN_FORMAT));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser())


app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname + '/public/', 'favicon.ico')));
app.use("/service-worker.js", express.static(path.join(__dirname + '/public/js/service-worker.js')));
app.use("/asset/js/", express.static(path.join(__dirname + '/public/js/')));
app.use("/asset/img/", express.static(path.join(__dirname + '/public/img/')));
app.use("/asset/css/", express.static(path.join(__dirname + '/public/css/')));
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
// Middleware 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});