const fs = require("fs");
const path = require('path');
const express = require('express');
const router = express.Router();

const jsonFilePath = path.join(__dirname, '../server/user.json');
const userList = JSON.parse(fs.readFileSync(jsonFilePath));

router.use((req, res, next) => {
    console.log('ejs dir');
    next();
});

router.get('/', function (req, res) {
    const data = {
        items: [
            {name: '<p>リンゴ</p>'},
            {name: '<p>バナナ</p>'},
            {name: '<p>スイカ</p>'}
        ],
        title: 'index.ejs'
    };

    res.render('./index.ejs', data);
});

router.get('/user/:user_id', (req, res, next) => {
    const userId = Number(req.params.user_id);
    let user = {
        id: null
    };

    if(userId){
        userList.forEach(userListItem => {
            if(userListItem.id === userId){
                user = Object.assign(user, userListItem);
            }
        });
    }

    console.log(user);

    res.render('./user.ejs', {user, title: 'user.ejs'});
});

exports.ejsTmpRoutePath = '/ejs';
exports.ejsTmpRouter = router;
