import express from 'express';
const router = express.Router();

import { formLogin, publicHome, validateUser,logout} from '../controllers/publicController.js';
// import { adminHome } from '../controllers/adminController.js';
// import { userHome } from '../controllers/userController.js';


router.get('/logout', logout)
router.get("/login", formLogin) //Login
router.get('/', publicHome);
router.post("/login", validateUser) //Login funcional

// router.get('/adminHome', adminHome); // Ruta para adminHome
// router.get("/userHome", userHome)//Vista de cada usuario





export default router