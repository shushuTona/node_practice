const express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');

const router = express.Router();

// db in prod
const user = {
    name: 'hoge',
    pass: '2022'
}

const varify = (username, password, cb) => {
    if(
        username !== user.name ||
        password !== user.pass
    ) {
        return cb(null, false, { message: 'Incorrect username or password.' });
    }

    const data = {
        username,
        password
    }

    console.log(data);

    return cb(null, data);
}
passport.use(new LocalStrategy(varify));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

router.get('/login', function(req, res, next) {
    const data = {
        title: 'login.ejs'
    };

    res.render('login.ejs', data);
});

router.get('/mypage', function(req, res, next) {
    const data = {
        title: 'mypage.ejs'
    };

    res.render('mypage.ejs', data);
});

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/auth/mypage',
    failureRedirect: '/auth/login'
}));

exports.authTmpRoutePath = '/auth';
exports.authTmpRouter = router;
