require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const app = express();

const http = require('http');
const server = http.createServer(app);
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser())

// const ejs = require('ejs');
app.set('view engine', 'ejs');
const path = require('path');

app.use("/asset/js/", express.static(path.join(__dirname + '/public/js/')));
app.use("/asset/img/", express.static(path.join(__dirname + '/public/img/')));
app.use("/asset/css/", express.static(path.join(__dirname + '/public/css/')));

const routes = require('./routes');
app.use('/', routes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});