'use strict';

const express = require('express');
const path = require('path');
const compression = require('compression');
const log = require('./log');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// router
const { testRoutePath, testRouter } = require('../routes/test');
const { ejsTmpRoutePath, ejsTmpRouter } = require('../routes/ejsTmp');
const { cookieTmpRoutePath, cookieTmpRouter } = require('../routes/cookie');
const { sessionTmpRoutePath, sessionTmpRouter } = require('../routes/session');
const { bcryptRoutePath, bcryptRouter } = require('../routes/bcrypt_password');
const { jwtRoutePath, jwtRouter } = require('../routes/jwt');
const { cacheTmpRoutePath, cacheTmpRouter } = require('../routes/cache');
const { authTmpRoutePath, authTmpRouter } = require('../routes/auth');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

// ejs使用設定
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(compression()) //gzip compression

// cookie設定
app.use(cookieParser());

// session設定
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 5 // 5分
    }
}));

// publicのファイルをそれぞれ表示・読み込みできるように設定
app.use(express.static('public'));

app.use(passport.authenticate('session'));

// ルーティング設定
app.use(testRoutePath, testRouter);
app.use(ejsTmpRoutePath, ejsTmpRouter);
app.use(cookieTmpRoutePath, cookieTmpRouter);
app.use(sessionTmpRoutePath, sessionTmpRouter);
app.use(bcryptRoutePath, bcryptRouter);
app.use(jwtRoutePath, jwtRouter);
app.use(cacheTmpRoutePath, cacheTmpRouter);
app.use(authTmpRoutePath, authTmpRouter);

app.use(require('../middleware/notFound'));

// 他のmiddlewareやルートの指定の最後に定義する
app.use(require('../middleware/defaultError'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

log.logDebug(`Running on http://${HOST}:${PORT}`);
