'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../middleware/auth';

var router = new Router();

router.get('/me', auth.bearer(true), controller.me);
router.get('/:id', controller.show);

export default router;
