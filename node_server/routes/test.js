const fs = require("fs");
const path = require('path');
const express = require('express');
const router = express.Router();

const jsonFilePath = path.join(__dirname, '../server/user.json');
const userList = JSON.parse(fs.readFileSync(jsonFilePath));

router.use((req, res, next) => {
    console.log('test dir');
    next();
});

router.get('/ab?cd', (req, res) => {
    res.send('/abcd or /acd');
});

router.get('/a+bc', (req, res) => {
    res.send('/abc or /aabc or /aaabc ...etc');
});

router.get('/x*z', (req, res) => {
    res.send('/xz or xyz or xabcdefdsdz ...etc');
});

router.get('/i_am(_not)?_you', (req, res) => {
    res.send('i_am_you or i_am_not_you');
});

router.get(/test1/, (req, res) => {
    res.send('include test1');
});

router.get(/.*test2$/, (req, res) => {
    res.send('last test2');
});

router.get('/get/:user_id', (req, res, next) => {
    const userId = Number(req.params.user_id);
    const findResult = userList.find((user_obj) => {
        return user_obj.id === userId;
    });

    if(!findResult){
        res.status(404);
        return res.end('not found! : ' + req.path);
    }

    const {age} = req.query;
    age ? (findResult['ageDiff'] = Math.abs(findResult['age'] - age)) : null;

    res.send(findResult);
});

router.post('/post', (req, res) => {
    console.log(req.body);
    const userId = Number(req.body.id);

    if(userId){
        const findResult = userList.find((user_obj) => {
            return user_obj.id === userId;
        });

        if(findResult){
            findResult['error'] = '';
            return res.json(findResult);
        }
    }

    res.json({error: 'not found'});
});

/**
 * URL : /users/100/item/200
 *
 * req.params : {"userId":"100","itemId":"200"}
 */
router.get('/users/:userId/item/:itemId', (req, res) => {
    res.send(req.params);
});

/**
 * URL : /map/tokyo-osaka
 *
 * req.params : {"from":"tokyo","to":"osaka"}
 */
router.get('/map/:from-:to', (req, res) => {
    res.send(req.params);
});

exports.testRoutePath = '/test';
exports.testRouter = router;
