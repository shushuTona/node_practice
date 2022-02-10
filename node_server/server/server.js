'use strict';

const express = require('express');
const path = require('path');

// router
const { testRoutePath, testRouter } = require('../routes/test');
const { ejsTmpRoutePath, ejsTmpRouter } = require('../routes/ejsTmp');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// publicのファイルをそれぞれ表示・読み込みできるように設定
app.use(express.static('public'));

// ルーティング設定
app.use(testRoutePath, testRouter);
app.use(ejsTmpRoutePath, ejsTmpRouter);

app.use(require('../middleware/notFound'));
app.use(require('../middleware/defaultError'));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
