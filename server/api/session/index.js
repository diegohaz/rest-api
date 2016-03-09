'use strict';

import {Router} from 'express';
import * as controller from './session.controller';
import * as auth from '../../middleware/auth';

var router = new Router();

router.post('/', auth.basic(), controller.create);
router.delete('/', auth.bearer(true), controller.destroy);

export default router;
