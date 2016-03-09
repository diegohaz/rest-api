'use strict';

import mongoose from 'mongoose';

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

ThingSchema.methods.view = function() {
  return {
    id: this.id,
    name: this.name,
    info: this.info,
    active: this.active
  };
};

export default mongoose.model('Thing', ThingSchema);
