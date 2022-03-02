const path = require('path');

// エラーが発生した際にステータスを500に設定してレスポンスを返す
const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.sendFile(path.join(__dirname, '../public/500.html'));
}

module.exports = errorMiddleware;
