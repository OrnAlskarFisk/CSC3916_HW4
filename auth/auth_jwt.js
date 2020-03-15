// Load required packages
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userMgr = require('../usermgr/common/usermgr');
require('dotenv').load();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        userMgr.findUserById(jwt_payload)
            .then(
                function (user) {
                    if (user)
                        done(null, user);
                    else
                        done(null, false);
                });
    }
));

exports.isAuthenticated = passport.authenticate('jwt', {session: false});
exports.secret = opts.secretOrKey;