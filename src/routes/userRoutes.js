import express from 'express'
import { formLogin, formPasswordRecovery, formRegister,userHome, insertUser ,confirmAccount, updatePassword, authenticateUser, emailChangePassword, formPasswordUpdate} from "../controllers/userController.js";



const router = express.Router();

router.get("/", formLogin) //Login
router.get("/register", formRegister) //Vista registro
router.get("/confirm/:token", confirmAccount);//Confirmar correo
router.get("/password-recovery", formPasswordRecovery); //olvide mi contraseña
router.post("/", authenticateUser) //Login funcional
router.get("/update-password/:token", formPasswordUpdate); //Comprobar token
router.get("/home", userHome)//Vista de cada usuario



export default router;