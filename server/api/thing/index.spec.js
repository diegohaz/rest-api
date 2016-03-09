'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var thingCtrlStub = {
  index: 'thingCtrl.index',
  show: 'thingCtrl.show',
  create: 'thingCtrl.create',
  update: 'thingCtrl.update',
  destroy: 'thingCtrl.destroy'
};

var queryStub = function() {
  return 'query';
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
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var thingIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './thing.controller': thingCtrlStub,
  '../../middleware/auth': authStub,
  '../../middleware/query/': queryStub
});

describe('Thing API Router:', function() {

  it('should return an express router instance', function() {
    thingIndex.should.equal(routerStub);
  });

  describe('GET /things', function() {

    it('should route to thing.controller.index', function() {
      routerStub.get
        .withArgs('/', 'query', 'thingCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /things/:id', function() {

    it('should route to thing.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'thingCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /things', function() {

    it('should route to thing.controller.create', function() {
      routerStub.post
        .withArgs('/', 'auth.bearer.true', 'thingCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /things/:id', function() {

    it('should route to thing.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'auth.bearer.true', 'thingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /things/:id', function() {

    it('should route to thing.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'auth.bearer.true', 'thingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /things/:id', function() {

    it('should route to thing.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'auth.bearer.true', 'thingCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
