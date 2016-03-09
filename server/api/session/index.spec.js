'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var sessionCtrlStub = {
  create: 'sessionCtrl.create',
  destroy: 'sessionCtrl.destroy'
};

var authStub = {
  basic() {
    return 'auth.basic';
  },
  bearer(required) {
    return 'auth.bearer' + (required? '.' + required : '');
  }
};

var routerStub = {
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
        .withArgs('/', 'auth.bearer.true', 'sessionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
