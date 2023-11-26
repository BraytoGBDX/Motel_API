// routes/adminRoutes.js
import express from 'express';
const router = express.Router();
import { registerAdmin, formRegisterAdmin } from '../controllers/adminController.js';

router.get('/register', formRegisterAdmin);

export default router;
