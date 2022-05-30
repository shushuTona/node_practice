const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const jwtSecret = 'secret_key_goes_here';
const jwtOptions = {
  algorithm: 'HS256',
  expiresIn: 60 * 60
}

router.get('/', (req, res) => {
    const data = {
        title: 'jwt.ejs'
    };

    res.render('./jwt.ejs', data);
});

router.post('/createToken', (req, res) => {
    const userName = req.body.userName;
    const pass = req.body.pass;

    if(
        userName === "user" &&
        pass === "user_pass"
    ) {
        const token = jwt.sign({ userName }, jwtSecret, jwtOptions);
        return res.json({
            success: true,
            token,
        });
    } else {
        return res.json({
            success: false,
            token: "",
        });
    }
});

router.post('/checkToken', (req, res) => {
    const authHeaderString = req.headers["authorization"];
    if(
        authHeaderString === undefined ||
        authHeaderString === ''
    ) {
        return res.json({
            success: false,
            token: "",
        });
    }

    const token = jwt.verify(authHeaderString, jwtSecret);
    if(
        token
    ) {
        return res.json({
            success: true,
            token,
        });
    } else {
        return res.json({
            success: false,
            token: "",
        });
    }
});

exports.jwtRoutePath = '/jwt';
exports.jwtRouter = router;
