import { Router } from 'express';
import { createField } from './field.controller.js';
import { getFields } from '../../configs/app.js';

const router = Router();

router.post(
    '/create',
    createField
)

router.get(
    '/',
    getFields
)

export default router;
