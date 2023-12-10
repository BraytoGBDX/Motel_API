import express from 'express'
import { userHome, formPasswordRecovery, formRegister, insertUser ,confirmAccount, formPasswordUpdate} from "../controllers/userController.js";
import protectRoute from '../middlewares/middleware.js';



const router = express.Router();

router.get('/register', formRegister) //Vista registro
router.post('/register', insertUser);
router.get("/confirm/:token", confirmAccount);//Confirmar correo
router.get("/password-recovery", formPasswordRecovery); //olvide mi contraseña
router.get("/update-password/:token", formPasswordUpdate); //Comprobar token
// router.get('/home', home);

router.get("/userHome", userHome)//Vista de cada usuario




export default router;