import express from 'express';
const router = express.Router();

import { adminHome, roomsview } from '../controllers/adminController.js';

router.get('/adminHome', adminHome)
router.get('/rooms', roomsview);



export default router