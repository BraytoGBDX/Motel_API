import express from 'express';
const router = express.Router();

import { adminHome, roomsview, reservasview} from '../controllers/adminController.js';

router.get('/adminHome', adminHome)
router.get('/rooms', roomsview);
router.get('/reservas', reservasview)



export default router