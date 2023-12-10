import express from 'express';
const router = express.Router();

import { adminHome } from '../controllers/adminController.js';

router.get('/adminHome', adminHome)


export default router