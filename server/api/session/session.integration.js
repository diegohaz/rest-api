'use strict';

var app = require('../..');
import request from 'supertest';

import Session from './session.model';

describe('Session API:', function() {

  before(function() {
    return Session.remove();
  });

  after(function() {
    return Session.remove();
  });

  describe('POST /sessions', function() {

    it('should start a new session', function(done) {
      request(app)
        .post('/sessions')
        .auth('test@example.com', 'password')
        .expect(201)
        .end((err, res) => {
          res.body.should.have.property('access_token');
          done();
        });
    });

    it('should start a new anonymous session', function(done) {
      request(app)
        .post('/sessions')
        .auth('anonymous', 'password')
        .expect(201)
        .end((err, res) => {
          res.body.should.have.property('access_token');
          done();
        });
    });

  });

  describe('DELETE /sessions', function() {

    it('should delete session', function() {
      var token;

      request(app)
        .post('/sessions')
        .auth('test@example.com', 'password')
        .expect(201)
        .then(function(res) {
          res.body.should.have.property('access_token');
          token = res.body.access_token;

          request(app)
            .delete('/sessions')
            .query({access_token: token})
            .expect(204);
        });
    });

    it('should not delete session without authorization', function() {
      request(app).delete('/sessions').expect(401);
    });

  });

});
