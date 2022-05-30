const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');

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

passport.serializeUser(function(user, done) {
    process.nextTick(function() {
        done(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
        return done(null, user);
    });
});

router.get('/login', function(req, res, next) {
    console.log(req);
    console.log(req.session.passport);

    const data = {
        title: 'login.ejs'
    };

    res.render('login.ejs', data);
});

router.get('/mypage', function(req, res, next) {
    console.log(req);
    console.log(req.session.passport);

    const data = {
        title: 'mypage.ejs'
    };

    res.render('mypage.ejs', data);
});

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/auth/mypage',
    failureRedirect: '/auth/login'
}));

router.post('/logout', function(req, res, next) {
    req.logout();

    console.log(res);

    res.redirect('/auth/login');
});

exports.authTmpRoutePath = '/auth';
exports.authTmpRouter = router;
