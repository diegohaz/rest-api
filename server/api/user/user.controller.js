'use strict';

import User from './user.model';

/**
 * Get a single user
 */
export function show(req, res, next) {
  return User.findById(req.params.id).then(user => {
    if (!user) return res.status(404).end();
    res.json(user.view());
  }).catch(next);
}

/**
 * Get my info
 */
export function me(req, res, next) {
  res.json(req.user.view(true));
}
