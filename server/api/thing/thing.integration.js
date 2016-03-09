'use strict';

var app = require('../..');
import request from 'supertest';

var newThing;

describe('Thing API:', function() {
  var token;

  before(function(done) {
    request(app)
      .post('/sessions')
      .auth('test@example.com', 'password')
      .expect(201)
      .end((err, res) => {
        if (err) done(err);
        token = res.body.access_token;
        done();
      });
  });

  describe('GET /things', function() {
    var things;

    beforeEach(function(done) {
      request(app)
        .get('/things')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          things = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      things.should.be.instanceOf(Array);
    });

  });

  describe('POST /things', function() {
    beforeEach(function(done) {
      request(app)
        .post('/things')
        .query({access_token: token})
        .send({
          name: 'New Thing',
          info: 'This is the brand new thing!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newThing = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      newThing.name.should.equal('New Thing');
      newThing.info.should.equal('This is the brand new thing!!!');
    });

  });

  describe('GET /things/:id', function() {
    var thing;

    beforeEach(function(done) {
      request(app)
        .get('/things/' + newThing.id)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          thing = res.body;
          done();
        });
    });

    afterEach(function() {
      thing = {};
    });

    it('should respond with the requested thing', function() {
      thing.name.should.equal('New Thing');
      thing.info.should.equal('This is the brand new thing!!!');
    });

  });

  describe('PUT /things/:id', function() {
    var updatedThing;

    beforeEach(function(done) {
      request(app)
        .put('/things/' + newThing.id)
        .query({access_token: token})
        .send({
          name: 'Updated Thing',
          info: 'This is the updated thing!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedThing = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedThing = {};
    });

    it('should respond with the updated thing', function() {
      updatedThing.name.should.equal('Updated Thing');
      updatedThing.info.should.equal('This is the updated thing!!!');
    });

  });

  describe('DELETE /things/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/things/' + newThing.id)
        .query({access_token: token})
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thing does not exist', function(done) {
      request(app)
        .delete('/things/' + newThing.id)
        .query({access_token: token})
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
