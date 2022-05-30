const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

router.use((req, res, next) => {
    console.log('bcrypt dir');
    next();
});

const basePassword = 'Test_2022';
router.get('/get_pass', (req, res) => {
    const hashPassword = bcrypt.hashSync(basePassword, 10);
    const data = {
        hashPass: hashPassword,
        title: 'bcrypt_password.ejs'
    };

    res.render('./bcrypt_password.ejs', data);
});

router.post('/check_pass', (req, res) => {
    const checkPassword = req.body.hashPass;
    const checkResult = { error: '' };

    if(!checkPassword){
        res.status(400);
        checkResult['error'] = 'password string required';
        return res.json(checkResult);
    }

    res.status(200);
    if(
        bcrypt.compareSync(basePassword, checkPassword)
    ) {
        return res.json(checkResult);
    } else {
        checkResult['error'] = 'password do not match';
        return res.json(checkResult);
    }
});

exports.bcryptRoutePath = '/bcrypt';
exports.bcryptRouter = router;
