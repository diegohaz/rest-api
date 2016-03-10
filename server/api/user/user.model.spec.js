'use strict';

import app from '../..';
import User from './user.model';
import Session from '../session/session.model';

var user;
var genUser = function() {
  user = new User({
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function() {
  before(function() {
    return User.remove();
  });

  beforeEach(function() {
    genUser();
  });

  afterEach(function() {
    return User.remove();
  });

  it('should begin with no users', function() {
    return User.find({}).should.eventually.have.lengthOf(0);
  });

  it('should fail when saving a duplicate user', function() {
    return user.save().then(() => genUser().save()).should.be.rejected;
  });

  it('should fail when saving without an email', function() {
    user.email = '';
    return user.save().should.be.rejected;
  });

  it('should remove user sessions after removing user', function() {
    return user.save()
      .then(user => Session.create({user: user}))
      .then(session => user.remove())
      .delay(20)
      .then(() => {
        return Session.find({user: user}).should.eventually.have.lengthOf(0);
      });
  });

  describe('password', function() {
    beforeEach(function() {
      return user.save();
    });

    it('should authenticate user if valid', function() {
      return user.authenticate('password').should.eventually.not.be.false;
    });

    it('should not authenticate user if invalid', function() {
      return user.authenticate('blah').should.eventually.be.false;
    });

    it('should remain the same hash unless the password is updated', function() {
      user.name = 'Test User';
      return user.save().then(u => u.authenticate('password')).should.eventually.not.be.false;
    });
  });

});
