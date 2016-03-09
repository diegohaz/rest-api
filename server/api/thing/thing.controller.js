'use strict';

import _ from 'lodash';
import Thing from './thing.model';

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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Things
export function index(req, res) {
  return Thing
    .find(req.search, null, req.options)
    .then(things => things.map(t => t.view()))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  return Thing
    .findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(thing => thing ? thing.view() : null)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req, res) {
  return Thing
    .create(req.body)
    .then(thing => thing.view())
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) delete req.body._id;

  return Thing
    .findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(thing => thing ? _.merge(thing, req.body).save() : null)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  return Thing
    .findById(req.params.id)
    .then(handleEntityNotFound(res))
    .then(thing => thing ? thing.remove() : null)
    .then(respondWithResult(res, 204))
    .catch(handleError(res));
}
