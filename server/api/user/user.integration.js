'use strict';

import app from '../..';
import User from './user.model';
import request from 'supertest';

describe('User API:', function() {
  var user;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    });
  });

  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('GET /users/:id', function() {

    it('should retrieve a user', function() {
      request(app)
        .get('/users/' + user.id)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('id').eql(user.id);
        });
    });

  });

  describe('GET /users/me', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/sessions')
        .auth('test@example.com', 'password')
        .expect(201)
        .end((err, res) => {
          token = res.body.access_token;
          done();
        });
    });

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/users/me')
        .query({access_token: token})
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('id');
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/users/me')
        .expect(401)
        .end(done);
    });
  });
});
