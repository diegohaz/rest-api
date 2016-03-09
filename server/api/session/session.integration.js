'use strict';

var app = require('../..');
import request from 'supertest';

import Session from './session.model';
import User from '../user/user.model';

describe('Session API:', function() {

  before(function() {
    return Session.remove();
  });

  after(function() {
    return Session.remove();
  });

  describe('GET /sessions', function() {
    var session, adminSession;

    before(function() {
      return User.create({
        name: 'Fake Admin',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin'
      }).then(admin => {
        adminSession = new Session({user: admin});
        return adminSession.save();
      }).then(adminSession => {
        return User.create({
          name: 'Fake User',
          email: 'user@example.com',
          password: 'pass'
        });
      }).then(user => {
        session = new Session({user: user});
        return session.save();
      });
    });

    after(function() {
      return User.remove();
    });

    it('should retrieve list of sessions when authenticated as admin', function(done) {
      request(app)
        .get('/sessions')
        .query({access_token: adminSession.token})
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.instanceOf(Array).and.have.lengthOf(2);
          done();
        });
    });

    it('should not retrieve list of sessions when authenticated as user', function(done) {
      request(app)
        .get('/sessions')
        .query({access_token: session.token})
        .expect(401)
        .end(done);
    });

    it('should not retrieve list of sessions when authenticated', function(done) {
      request(app)
        .get('/sessions')
        .query({access_token: session.token})
        .expect(401)
        .end(done);
    });

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
