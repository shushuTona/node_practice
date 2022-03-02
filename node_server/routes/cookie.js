const express = require('express');
const router = express.Router();

const getAppCookie = (req) => {
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};
    rawCookies.forEach((rawCookie) => {
        const cookie = rawCookie.split('=');

        parsedCookies[cookie[0]] = cookie[1];
    });

    return parsedCookies;
}

router.use((req, res, next) => {
    const parsedCookies = getAppCookie(req);

    res.locals.testCookie = parsedCookies['test_cookie'];

    next();
});

router.get('/', (req, res) => {
    if(
        res.locals.testCookie
    ) {
        res.send('set Test cookie page.');
    } else {
        res.cookie('test_cookie', 'cookie_value', {
            maxAge: 60 * 60,
    
            // クライアント側でcookieを触れなくする
            httpOnly: true
        });
    
        res.send('Test cookie page.');
    }
});

exports.cookieTmpRoutePath = '/cookie';
exports.cookieTmpRouter = router;
