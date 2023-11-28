import express from 'express'
import { formPasswordRecovery, formRegister, insertUser ,confirmAccount, formPasswordUpdate} from "../controllers/userController.js";



const router = express.Router();

router.get('/register', formRegister) //Vista registro
router.post('/register', insertUser);
router.get("/confirm/:token", confirmAccount);//Confirmar correo
router.get("/password-recovery", formPasswordRecovery); //olvide mi contraseña
// router.post("/login", authenticateUser) //Login funcional
router.get("/update-password/:token", formPasswordUpdate); //Comprobar token
// router.get('/home', home);

// router.get("/home", userHome)//Vista de cada usuario




export default router;