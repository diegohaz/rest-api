/**
 * Main application routes
 */

'use strict';

import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/things', require('./api/thing'));
  app.use('/sessions', require('./api/session'));
  app.use('/users', require('./api/user'));

}
