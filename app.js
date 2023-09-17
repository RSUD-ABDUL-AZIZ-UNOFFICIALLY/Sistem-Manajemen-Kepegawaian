require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const app = express();
const path = require('path');


const http = require('http');
const server = http.createServer(app);
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const MORGAN_FORMAT = process.env.MORGAN_FORMAT || 'dev';
app.use(morgan(MORGAN_FORMAT));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser())


app.set('view engine', 'ejs');
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    profilesSampleRate: 1.0,
    integrations: [
        new ProfilingIntegration(),
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({
            // to trace all requests to the default router
            app,
            // alternatively, you can specify the routes you want to trace:
            // router: someRouter,
        }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});
// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(favicon(path.join(__dirname + '/public/', 'favicon.ico')));
app.use("/asset/js/", express.static(path.join(__dirname + '/public/js/')));
app.use("/asset/img/", express.static(path.join(__dirname + '/public/img/')));
app.use("/asset/css/", express.static(path.join(__dirname + '/public/css/')));

const routes = require('./routes');
app.use('/', routes);

app.use(Sentry.Handlers.errorHandler());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});