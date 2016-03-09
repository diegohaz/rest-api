'use strict';

import {Router} from 'express';
import query from '../../middleware/query/';
import * as controller from './thing.controller';
import * as auth from '../../middleware/auth';

var router = new Router();

router.get('/', query(), controller.index);
router.get('/:id', controller.show);
router.post('/', auth.bearer(true), controller.create);
router.put('/:id', auth.bearer(true), controller.update);
router.patch('/:id', auth.bearer(true), controller.update);
router.delete('/:id', auth.bearer(true), controller.destroy);

export default router;
