'use strict';

import moment from 'moment';
import tk from 'timekeeper';

import Session from './session.model';
import User from '../user/user.model';

describe('Session Model', function() {
  var session;

  before(function() {
    return User.remove().then(() => Session.remove());
  });

  beforeEach(function() {
    return User.create({
      email: 'test@example.com',
      password: 'password'
    }).then(user => {
      session = new Session({user: user});
    });
  });

  afterEach(function() {
    tk.reset();
    return User.remove().then(() => Session.remove());
  });

  it('should begin with no sessions', function() {
    return Session.find({}).should.eventually.have.lengthOf(0);
  });

  it('should set expiration date automatically', function() {
    return session.save().then(session => {
      var nextYear = moment().add(1, 'years');
      nextYear.diff(moment(session.expiresAt)).should.be.within(0, 30);
    });
  });

  it('should update expiration time', function() {
    return session.save().delay(50).then(session => {
      return session.save();
    }).then(session => {
      var nextYear = moment().add(1, 'years');
      nextYear.diff(moment(session.expiresAt)).should.be.within(0, 30);
    });
  });

  it('should expire after 1 year', function() {
    return session.save().then(session => {
      var nextYear = moment().add(1, 'years');
      tk.freeze(nextYear.toDate());
      session.expired().should.be.true;
    });
  });

  it('should not expire until 1 year later', function() {
    return session.save().then(session => {
      var almostNextYear = moment().add(1, 'years').subtract(1, 'seconds');
      tk.freeze(almostNextYear.toDate());
      session.expired().should.be.false;
    });
  });

  it('should not login with invalid token', function() {
    return session.save().then(session => {
      return Session.login('wrong token').should.be.rejectedWith('Invalid session');
    });
  });

  it('should not login with expired token', function() {
    return session.save().then(session => {
      var nextYear = moment().add(1, 'years');
      tk.freeze(nextYear.toDate());
      return Session.login(session.token).should.be.rejectedWith('Session has expired');
    });
  });


});
