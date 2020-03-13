const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const userController = require('../usermgr/common/usermgr');
const crypto = require('crypto');

passport.use(new BasicStrategy(
    function (username, password, done) {
        userController.findUserByLogin(username, password)
            .then(function (user) {
                if (user) {
                    return done(null, {name: user.username});
                } else {
                    return done(null, false);
                }
            });
    }
));

exports.isAuthenticated = passport.authenticate('basic', {session: false});