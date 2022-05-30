const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if(
        req.session.viewCount
    ) {
        req.session.viewCount++;
        res.send(`req.session.viewCount : ${req.session.viewCount}`);
    } else {
        req.session.viewCount = 1;
        res.send('Test session');
    }

    console.log(req.session.viewCount);
});

exports.sessionTmpRoutePath = '/session';
exports.sessionTmpRouter = router;
