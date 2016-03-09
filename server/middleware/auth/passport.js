'use strict';

import passport from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';

import User from '../../api/user/user.model';
import Session from '../../api/session/session.model';

passport.use(new BasicStrategy((email, password, done) => {
  User.findOne({email: email.toLowerCase()}).then(user => {
    if (!user) return User.create({email: email, password: password});

    return user.authenticate(password, user.password);
  }).then(user => done(null, user)).catch(done);
}));

passport.use(new BearerStrategy({passReqToCallback: true}, (req, token, done) => {
  Session.login(token).then(session => {
    req.session = session;
    done(null, session.user);
  }).catch(done);
}));

export default passport;