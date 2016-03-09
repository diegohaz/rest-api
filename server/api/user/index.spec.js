'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userCtrlStub = {
  index: 'userCtrl.index',
  me: 'userCtrl.me',
  show: 'userCtrl.show',
  create: 'userCtrl.create',
  update: 'userCtrl.update',
  destroy: 'userCtrl.destroy'
};

var queryStub = function() { return 'query' };

var authStub = {
  basic() { return 'auth.basic' },
  bearer() { return 'auth.bearer' }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './user.controller': userCtrlStub,
  '../../middleware/auth': authStub,
  '../../middleware/query/': queryStub
});

describe('User API Router:', function() {

  it('should return an express router instance', function() {
    userIndex.should.equal(routerStub);
  });

  describe('GET /users', function() {

    it('should route to user.controller.index', function() {
      routerStub.get
        .withArgs('/', 'auth.bearer', 'query', 'userCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /users/me', function() {

    it('should route to user.controller.me', function() {
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

  describe('POST /users', function() {

    it('should route to user.controller.create', function() {
      routerStub.post
        .withArgs('/', 'auth.bearer', 'userCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /users/:id', function() {

    it('should route to user.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'auth.bearer', 'userCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /users/:id', function() {

    it('should route to user.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'auth.bearer', 'userCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /users/:id', function() {

    it('should route to user.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'auth.bearer', 'userCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
