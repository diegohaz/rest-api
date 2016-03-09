'use strict';

import passport from './passport';
import User from '../../api/user/user.model';

export function bearer({
  required = false,
  roles = User.roles
} = {}) {
  return function(req, res, next) {
    passport.authenticate('bearer', {session: false}, (err, user, info) => {
      if (err || (required && !user) || (required && roles.indexOf(user.role) === -1)) {
        return res.status(401).end();
      }

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