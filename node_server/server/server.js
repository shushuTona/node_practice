'use strict';

const express = require('express');
const path = require('path');

// router
const { testRoutePath, testRouter } = require('../routes/test');

// middleware
const notFound = require('../middleware/notFound');
const defaultError = require('../middleware/defaultError');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// publicのファイルをそれぞれ表示・読み込みできるように設定
app.use(express.static('public'));

// test配下のルーティング設定
app.use(testRoutePath, testRouter);

app.use(notFound);
app.use(defaultError);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
