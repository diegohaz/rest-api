'use strict';

import app from '../..';
import User from './user.model';
import Session from '../session/session.model';
import request from 'supertest';

describe('User API:', function() {
  var session, adminSession;

  // Clear users before testing
  before(function() {
    return User.remove().then(() => {
      return User.create({
        name: 'Fake Admin',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin'
      });
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

  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('GET /users', function() {

    it('should retrieve list of users when authenticated as admin', function(done) {
      request(app)
        .get('/users')
        .query({access_token: adminSession.token})
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.instanceOf(Array);
          done();
        });
    });

    it('should retrieve list of users when authenticated as admin with options', function(done) {
      request(app)
        .get('/users')
        .query({access_token: adminSession.token, page: 2, per_page: 1})
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.instanceOf(Array).with.lengthOf(1);
          res.body[0].should.have.property('id', session.user.id);
          done();
        });
    });

    it('should fail when authenticated as user', function(done) {
      request(app)
        .get('/users')
        .query({access_token: session.token})
        .expect(401)
        .end(done);
    });

    it('should fail when not authenticated', function(done) {
      request(app).get('/users').expect(401).end(done);
    });
  });

  describe('GET /users/me', function() {

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/users/me')
        .query({access_token: session.token})
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.have.property('id', session.user.id);
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

  describe('GET /users/:id', function() {

    it('should retrieve a user', function(done) {
      request(app)
        .get('/users/' + session.user.id)
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.have.property('id', session.user.id);
          done();
        });
    });

  });

  describe('POST /users', function() {

    it('should respond with the created user when authenticated as admin', function(done) {
      request(app)
        .post('/users')
        .send({access_token: adminSession.token, email: 'a@a.com', password: 'pass'})
        .expect(201)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.have.property('id');
          done();
        });
    });

    it('should fail when authenticated as user', function(done) {
      request(app)
        .post('/users')
        .send({access_token: session.token, email: 'b@b.com', password: 'pass'})
        .expect(401)
        .end(done);
    });

    it('should fail when not authenticated', function(done) {
      request(app)
        .post('/users')
        .send({email: 'b@b.com', password: 'pass'})
        .expect(401)
        .end(done);
    });

  });

  describe('PUT /users/:id', function() {

    it('should respond with the updated user when authenticated as admin', function(done) {
      request(app)
        .put('/users/' + session.user.id)
        .send({
          access_token: adminSession.token,
          name: 'Fake User 2',
          email: 'test2@example.com'
        })
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.have.property('name', 'Fake User 2');
          done();
        });
    });

    it('should fail when authenticated as user', function(done) {
      request(app)
        .put('/users/' + session.user.id)
        .send({
          access_token: session.token,
          name: 'Fake User 2',
          email: 'test2@example.com'
        })
        .expect(401)
        .end(done);
    });

    it('should fail when not authenticated', function(done) {
      request(app)
        .put('/users/' + session.user.id)
        .send({name: 'Fake User 2', email: 'test2@example.com'})
        .expect(401)
        .end(done);
    });

  });

  describe('DELETE /users/:id', function() {

    it('should delete when authenticated as admin', function(done) {
      request(app)
        .delete('/users/' + session.user.id)
        .send({access_token: adminSession.token})
        .expect(204)
        .end(done);
    });

    it('should respond with 404 when user does not exist', function(done) {
      request(app)
        .delete('/users/' + session.user.id)
        .send({access_token: adminSession.token})
        .expect(404)
        .end(done);
    });

    it('should fail when authenticated as user', function(done) {
      request(app)
        .delete('/users/' + session.user.id)
        .send({access_token: session.token})
        .expect(401)
        .end(done);
    });

    it('should fail when not authenticated', function(done) {
      request(app)
        .delete('/users/' + session.user.id)
        .expect(401)
        .end(done);
    });

  });
});
