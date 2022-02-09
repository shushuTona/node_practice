// 存在しないページの場合404ページにリダイレクトさせる
const notFound = (req, res, next) => {
    res.status(404);
    res.sendFile(path.join(__dirname, '../public/404.html'));
}

module.exports = notFound;
