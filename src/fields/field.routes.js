import { Router } from 'express';
import { createField } from './field.controller.js';
import { getFields } from '../../configs/app.js';
import { uploadFieldImage } from '../../middlewares/file-uploader.js';

const router = Router();

router.post(
    '/create',
    uploadFieldImage.single('image'),
    cleanUploaderFileOnFinish,
    createField
)

router.get(
    '/',
    getFields
)

export default router;
