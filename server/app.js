// native packages
const path = require('path');

// server packages
const express = require('express');
const ReactDOMServer = require('react-dom/server');
const StaticRouter = require('react-router-dom').StaticRouter;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const favicon = require('serve-favicon');
const helmet = require('helmet');

// local packages
const db = require('./database');
const api = require('./api');

// init express
const app = express();
const rootpath = path.join(__dirname, '../dist');

// security
app.use(helmet());
app.disable('x-powered-by');

// middlewares
app.use(lessMiddleware(rootpath));
app.use('/js', express.static(path.resolve(path.join(rootpath, 'js'))));
app.use('/css', express.static(path.resolve(path.join(rootpath, 'css'))));
app.use(favicon(path.join(rootpath, 'favicon.png')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.isAuthenticated = () => {
    const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  const payload = req.isAuthenticated();
  if (payload) {
    db.getUserById(payload.sub)
      .then((resp) => {
        req.user = resp;
        next();
      });
  } else {
    next();
  }
});

// add all endpoints to express app
api(app);

// all other requests get index.html
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: rootpath });
});

module.exports = app;
