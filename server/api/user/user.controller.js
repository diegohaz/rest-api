'use strict';

import User from './user.model';
import _ from 'lodash';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Users
export function index(req, res) {
  return User
    .find(req.search, null, req.options)
    .then(users => users.map(t => t.view()))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Get single User
export function show(req, res, next) {
  return User
    .findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(user => user ? user.view() : null)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Get my info
export function me(req, res, next) {
  res.json(req.user.view());
}

// Creates a new User in the DB
export function create(req, res) {
  return User
    .create(req.body)
    .then(user => user.view())
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing User in the DB
export function update(req, res) {
  if (req.body._id) delete req.body._id;
  if (req.body.password) delete req.body.password;

  return User
    .findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(user => user ? _.merge(user, req.body).save() : null)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a User from the DB
export function destroy(req, res) {
  return User
    .findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(user => user ? user.remove() : null)
    .then(respondWithResult(res, 204))
    .catch(handleError(res));
}