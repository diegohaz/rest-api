'use strict';

import bcrypt from 'bcrypt';
import randtoken from 'rand-token';
import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var compare = require('bluebird').promisify(bcrypt.compare);

var UserSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  }
});

/**
 * Allow anonymous registration
 */
UserSchema.path('email').set(function(email) {
  if (email === 'anonymous') {
    return randtoken.generate(16) + '@anonymous.com';
  } else {
    return email;
  }
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  var rounds = process.env.NODE_ENV === 'test'? 1 : 9;

  bcrypt.hash(this.password, rounds, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

/**
 * View
 */
UserSchema.methods.view = function() {
  return {
    id: this.id,
    name: this.name
  };
};

/**
 * Authenticate
 */
UserSchema.methods.authenticate = function(password) {
  return compare(password, this.password).then(valid => {
    return valid ? this : false;
  });
};

export default mongoose.model('User', UserSchema);
