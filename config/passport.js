const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const {
    secretOrKey
} = require('../config/key');

const opts = {};
  
const mongoose = require('mongoose');
// const User = mongoose.model('user');

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {

    }));
}