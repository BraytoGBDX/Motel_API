import express from 'express'
import { userHome,eliminarReserva,updatePassword, historial, saveReservation, reservacion, formPasswordRecovery, formRegister, insertUser ,confirmAccount, formPasswordUpdate,emailChangePassword} from "../controllers/userController.js";
import protectRoute from '../middlewares/middleware.js';



const router = express.Router();

router.get('/register', formRegister) //Vista registro
router.post('/register', insertUser);
router.get("/confirm/:token", confirmAccount);//Confirmar correo
router.get("/password-recovery", formPasswordRecovery); //olvide mi contraseña
router.post("/password-recovery", emailChangePassword);

router.get("/update-password/:token", formPasswordUpdate); //Comprobar token
router.post("/update-password/:token", updatePassword); //Nuevo passwordrouter.get('/', (request, response) => response.render("layout/index.pug", { page: "Home" }));//MI ENDPOINT DE PINTADOS


router.get("/userHome", userHome)//Vista de cada usuario
router.get("/reservacion", reservacion)
router.post("/reservacion",saveReservation)
router.get("/historial",historial)
router.post('/eliminarReservacion/:id', eliminarReserva);




export default router;