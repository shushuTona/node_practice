const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const data = {
        title: 'cache.ejs'
    };

    res.set('Cache-control', 'public, max-age=300');

    res.render('./cache.ejs', data);
});

exports.cacheTmpRoutePath = '/cache';
exports.cacheTmpRouter = router;
