import express from 'express'
import { userHome, historial, saveReservation, reservacion, formPasswordRecovery, formRegister, insertUser ,confirmAccount, formPasswordUpdate} from "../controllers/userController.js";
import protectRoute from '../middlewares/middleware.js';



const router = express.Router();

router.get('/register', formRegister) //Vista registro
router.post('/register', insertUser);
router.get("/confirm/:token", confirmAccount);//Confirmar correo
router.get("/password-recovery", formPasswordRecovery); //olvide mi contraseña
router.get("/update-password/:token", formPasswordUpdate); //Comprobar token

router.get("/userHome", userHome)//Vista de cada usuario
router.get("/reservacion", reservacion)
router.post("/reservacion",saveReservation)
router.get("/historial",historial)


export default router;