'use strict';

const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser')

// router
const { testRoutePath, testRouter } = require('../routes/test');
const { ejsTmpRoutePath, ejsTmpRouter } = require('../routes/ejsTmp');
const { cookieTmpRoutePath, cookieTmpRouter } = require('../routes/cookie');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser());

// publicのファイルをそれぞれ表示・読み込みできるように設定
app.use(express.static('public'));

// ルーティング設定
app.use(testRoutePath, testRouter);
app.use(ejsTmpRoutePath, ejsTmpRouter);
app.use(cookieTmpRoutePath, cookieTmpRouter);

app.use(require('../middleware/notFound'));

// 他のmiddlewareやルートの指定の最後に定義する
app.use(require('../middleware/defaultError'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
