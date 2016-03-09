'use strict';

import Session from './session.model';

// Creates a new session in the DB.
export function index(req, res) {
  Session
    .find({}, null, {sort: {'user.name': 1}})
    .populate('user')
    .then(sessions => {
      res.status(200).json(sessions.map(s => s.view()));
    })
    .catch(e => {
      res.status(500).send(e);
    });
}

// Creates a new session in the DB.
export function create(req, res) {
  Session.create({user: req.user}).then(session => {
    res.status(201).json(session.view());
  }).catch(e => {
    res.status(500).send(e);
  });
}

// Deletes a session from the DB.
export function destroy(req, res) {
  Session.findOneAndRemove({token: req.session.token}).then(() => {
    res.status(204).send('No Content');
  }).catch(e => {
    res.status(500).send(e);
  });
}
