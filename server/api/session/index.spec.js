'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var sessionCtrlStub = {
  index: 'sessionCtrl.index',
  create: 'sessionCtrl.create',
  destroy: 'sessionCtrl.destroy'
};

var authStub = {
  basic() { return 'auth.basic' },
  bearer() { return 'auth.bearer' }
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var sessionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './session.controller': sessionCtrlStub,
  '../../middleware/auth': authStub
});

describe('Session API Router:', function() {

  it('should return an express router instance', function() {
    sessionIndex.should.equal(routerStub);
  });

  describe('GET /sessions', function() {

    it('should route to session.controller.index with bearer authentication', function() {
      routerStub.get
        .withArgs('/', 'auth.bearer', 'sessionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /sessions', function() {

    it('should route to session.controller.create with basic authentication', function() {
      routerStub.post
        .withArgs('/', 'auth.basic', 'sessionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /sessions', function() {

    it('should route to session.controller.destroy with bearer authentication', function() {
      routerStub.delete
        .withArgs('/', 'auth.bearer', 'sessionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
