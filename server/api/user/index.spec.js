'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userCtrlStub = {
  show: 'userCtrl.show',
  me: 'userCtrl.me',
};

var authStub = {
  bearer() { return 'auth.bearer' }
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var userIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './user.controller': userCtrlStub,
  '../../middleware/auth': authStub
});

describe('User API Router:', function() {

  it('should return an express router instance', function() {
    userIndex.should.equal(routerStub);
  });

  describe('GET /users/me', function() {

    it('should be authenticated and route to user.controller.me', function() {
      routerStub.get
        .withArgs('/me', 'auth.bearer', 'userCtrl.me')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /users/:id', function() {

    it('should route to user.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'userCtrl.show')
        .should.have.been.calledOnce;
    });

  });

});
