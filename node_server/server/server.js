'use strict';

const express = require('express');
const path = require('path');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

// publicのファイルをそれぞれ表示・読み込みできるように設定
app.use(express.static('public'));

// 存在しないページの場合404ページにリダイレクトさせる
app.use((req, res, next) => {
    res.status(404);
    res.redirect('404.html');
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
