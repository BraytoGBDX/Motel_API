import express from 'express';
const router = express.Router();

import { adminHome, roomsview, reservasview,editRooms,updateRooms, updateUser,editUser} from '../controllers/adminController.js';

router.get('/adminHome', adminHome)
router.get('/rooms', roomsview);
router.get('/reservas', reservasview)
router.get('/editRooms/:roomId', editRooms)
router.post('/editRooms/:roomId',updateRooms)
router.get('/editUser/:userId', editUser);
router.post('/editUser/:userId', updateUser);




export default router