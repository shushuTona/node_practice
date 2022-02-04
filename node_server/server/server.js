'use strict';

const express = require('express');
const path = require('path');

// router
const { testRoutePath, testRouter } = require('../routes/test');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

// publicのファイルをそれぞれ表示・読み込みできるように設定
app.use(express.static('public'));

// test配下のルーティング設定
app.use(testRoutePath, testRouter);

// 存在しないページの場合404ページにリダイレクトさせる
app.use((req, res, next) => {
    res.status(404);
    res.sendFile(path.join(__dirname, '../public/404.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
