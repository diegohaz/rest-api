'use strict';

import {Router} from 'express';
import * as controller from './session.controller';
import * as auth from '../../middleware/auth';

var router = new Router();

router.get('/',
  auth.bearer({required: true, roles: ['admin']}),
  controller.index);

router.post('/', auth.basic(), controller.create);
router.delete('/', auth.bearer({required: true}), controller.destroy);

export default router;
