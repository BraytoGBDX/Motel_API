import express from 'express';
const router = express.Router();

import { formLogin, publicHome, validateUser, adminHome } from '../controllers/publicController.js';

router.get("/login", formLogin) //Login
router.get('/adminHome', adminHome)
router.get('/', publicHome);
router.post("/login", validateUser) //Login funcional



export default router