'use strict';

import passport from './passport';

export function bearer(required = false) {
  return function(req, res, next) {
    passport.authenticate('bearer', {session: false}, (err, user, info) => {
      if (err || required && !user) return res.status(401).end();

      req.logIn(user, {session: false}, err => {
        if (err) return res.status(401).end();
        next();
      });
    })(req, res, next);
  }
}

export function basic() {
  return passport.authenticate('basic', {session: false});
}