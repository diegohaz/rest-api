/**
 * Main application routes
 */

'use strict';

import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/sessions', require('./api/session'));
  app.use('/users', require('./api/user'));

}
