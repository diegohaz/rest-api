/**
 * Main application routes
 */

'use strict';

import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));

}
