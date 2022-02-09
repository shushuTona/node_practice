// エラーが発生した際にステータスを500に設定してレスポンスを返す
const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error!');
}

module.exports = errorMiddleware;
