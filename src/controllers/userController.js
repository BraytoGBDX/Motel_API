import User from "../models/user.js";
import { check, validationResult } from "express-validator";
import { generateToken, generateJwt } from "../lib/tokens.js";
import bcrypt from 'bcrypt';
import { emailRegister, emailPasswordRecovery } from "../lib/emails.js";
import  jsonWebToken  from "jsonwebtoken";
import Reservaciones from "../models/reservaciones.js";
import Rooms from "../models/rooms.js";




const formLogin = (request, response) => {

    response.render("../views/auth/login.pug", {
        isLogged: false,
        page: "Accede",

    })
}

const formPasswordUpdate = async (request, response) => {
    const { token } = request.params;
    const user = await User.findOne({ where: { token } });
    console.log(user);
    if (!user) {
        response.render('auth/confirm-account', {
            page: 'recuperación de contraseña',
            error: true,
            msg: 'Hemos encontrado algunos problemas y no pudimos verificar tu cuenta.',
            button: 'Acceso denegado'
        });
    }

    response.render("auth/password-update", {
        isLogged: false,
        page: "Actualizacion de Contrasena",

    })
}

const formRegister = (request, response) => {

    response.render("auth/userRegister.pug", {
        page: "Crear nueva Cuenta.",

    })
}

const formPasswordRecovery = (request, response) => {

    response.render("auth/recovery.pug", {
        page: "Recuperar su Contrasena",

    })
}

const insertUser = async (req, res) => {

    console.log("Intentando registrar los datos del nuevo usuario en la Base de Datos");
    console.log(`Nombre: ${req.body.name}`);
    //*Validando
    await check("name").notEmpty().withMessage("SE REQUIERE TU NOMBRE").run(req); //* Express verifica que el nombre no esté vacío AHORA MISMO
    await check("email").notEmpty().withMessage("SE REQUIERE TU CORREO ELECTRÓNICO").isEmail().withMessage("ESTO NO ES UN FORMATO DE CORREO ELECTRÓNICO").run(req);
    await check("password").notEmpty().withMessage("SE REQUIERE TU CONTRASEÑA").isLength({ min: 8, max: 20}).withMessage("TU CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES").run(req);
    await check("confirmPassword").notEmpty().withMessage("SE REQUIERE TU CONTRASEÑA").isLength({ min: 8, max: 20 }).withMessage("TU CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES").equals(req.body.password).withMessage("AMBOS CAMPOS DE CONTRASEÑA DEBEN SER IGUALES").run(req);

    //res.json(validationResult(req));//*PARA VER EL JSON
    console.log(`El total de errores fueron de: ${validationResult.length} errores de validación`)

    let resultValidate = validationResult(req);
    const userExists = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    const { name, email, password } = req.body;

    if (userExists) {

        res.render("auth/register.pug", ({
            page: "Nueva Cuenta",
            errors: [{ msg: `El Usuario ${req.body.email} existe.` }],
            user: {
                name: req.body.name,
                email: req.body.email
            },


        }))
    }else if (resultValidate.isEmpty()) {
        const token = generateToken();
        //*Creando usuario */

        let newUser = await User.create({
            name, email, password, token
        });
        res.render("templates/message.pug", {
            page: "Cracion de cuenta satisfactoria.",
            message: email,
            type: "success"

        }) //* Esta linea es la que inserta

        emailRegister({email, name, token});

    }

    else {
        res.render("auth/userRegister.pug", ({
            page: "Nueva Cuenta",
            errors: resultValidate.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            },

        }))
    }


}

const confirmAccount = async (req, res) => {

    const tokenRecived = req.params.token
    const userOwner = await User.findOne({
        where: {
            token: tokenRecived
        }
    })
    if (!userOwner) {

        console.log("El token no existe");
            res.render('auth/confirm-account', {
                page: 'Verificación de estado.',
                error: true,
                msg: 'Hemos encontrado algunos problemas y no pudimos verificar tu cuenta.',
                button: 'Acceso denegado'
            })
    }
    else {
        console.log("El token existe");
        userOwner.token = null;
        userOwner.verified = true;
        await userOwner.save();
        // ESTA OPERACION REALIZA EL UPDATE EN LA BASE DE DATOS.
        res.render('auth/confirm-account', {
            page: 'Verificación de estado.',
            error: false,
            msg: 'Tu cuenta ha sido confirmada exitosamente.',
            button: 'Ahora puedes iniciar sesión',
        });
        

    };


}

const updatePassword = async (req, res) => {
 console.log(`Guardando password`);

 await check("password").notEmpty().withMessage("SE REQUIERE TU CONTRASEÑA").isLength({ min: 8 }).withMessage("TU CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES").run(req);
 await check("confirmPassword").notEmpty().withMessage("SE REQUIERE TU CONTRASEÑA").isLength({ min: 8 }).withMessage("TU CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES").equals(req.body.password).withMessage("AMBOS CAMPOS DE CONTRASEÑA DEBEN SER IGUALES").run(req);

 let resultValidate = validationResult(req);
 if(resultValidate.isEmpty()) {
    const {token} = req.params
 const {password} = req.body
 const user = await User.findOne({where:{token}})

 const salt = await bcrypt.genSalt(10);
 user.password = await bcrypt.hash(password,salt);
 user.token = null;
 await user.save();
 res.render('auth/confirm-account.pug', {
    page: "Recuperación de contraseña",
    button: "Volver al inicio de sesión",
    msg: "La contraseña se ha cambiado correctamente",
})
 }

 else{ 
    res.render("auth/password-update.pug", ({
    page: "Nueva cuenta",
    errors:resultValidate.array()

}))}

}

const emailChangePassword = async (req, res) => {
    console.log(`El usuario ha solicitado cambiar su contraseña por lo que se le enviara un correo electronico a ${req.body.email} con la liga para actualizar su contraseña.`)
    await check("email").notEmpty().withMessage("TU EMAIL ES REQUERIDO").isEmail().withMessage("NO ES FORMATO EMAIL").run(req);
    let resultValidate = validationResult(req);
    const { name, email } = req.body;

    if (resultValidate.isEmpty()) {
        const userExists = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!userExists) { //Si no existe
            console.log(`El usuario: ${email} que esta intentando recuperar su contraseña no existe`);
            res.render("templates/message.pug", {
                page: "User not found",
                part1: 'El usuario asociado con: ',
                part2: ' No existe en la base de datos.',
                message: `${email}`,
                type: 'error'
            });
        }
        else {
            console.log("envio de correo");
            const token = generateToken();
            userExists.token = token;
            userExists.save();

            //TODO: enviar el correo con el nuevo token

            emailPasswordRecovery({ name: userExists.name, email: userExists.email, token: userExists.token })

            res.render('templates/message', {
                page: 'Email Send',
                message: `${email}`,
                type: "success",
                // button:'Now you can login',

            });
        }
    }
    else {
        res.render('auth/recovery', {
            page: 'Status verification.',
            error: false,
            msg: 'Tu cuenta a sido creada con exito.',
            button: 'Ahora puedes iniciar sesión',
            errors: resultValidate.array(), user: {
                name: req.body.name,
                email: req.body.email
            },
        });
    }
    return 0;
}


const userHome= async(req,res) =>{
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING)
    const loggedUser = await User.findByPk(decoded.userID)
    res.render('user/userHome',{
        showHeader: true,
        isLogged: true,
        page:"User",
        loggedUser
    })
  }

  const reservacion = (req,res) =>{
    res.render('user/reservacion',{
        showHeader: true,
    })
  }

  const saveReservation = async (req, res) => {

    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING)
    const loggedUser = await User.findByPk(decoded.userID)
    const { tipoReserva, fecha, hora, tipoHabitacion } = req.body;
  
    try {
      const habitacionDisponible = await Rooms.findOne({
        where: {
          type: tipoHabitacion,
          status: 1,
        },
      });
  
      if (habitacionDisponible) {
        const reservacion = await Reservaciones.create({
          tipoReserva: tipoReserva,
          fecha: fecha,
          hora: hora,
          user_ID: loggedUser.id,
          room_ID: habitacionDisponible.id,
        });

        habitacionDisponible.status=0;
        habitacionDisponible.save()
  
        console.log(`Habitación reservada: ${habitacionDisponible.id}`);
  
        res.redirect('historial');
      } else {
        res.render('templates/msgUser.pug',{
            page:"Ups...Lo sentimos",
            button:"Volver al inicio",
            error: true,
            msg:"Por el momento no hay habitaciones disponibles"
         })
      }
    } catch (error) {
      console.error('Error al guardar la reservación:', error.message);
    }
  };



  const historial = async (req, res) => {
    try {
      // Obtiene el ID del usuario a partir del token
      const token = req.cookies._token;
      const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
      const loggedUser = await User.findByPk(decoded.userID);
  
      // Busca las reservaciones asociadas al usuario
      const historialReservaciones = await Reservaciones.findAll({
        where: { user_ID: loggedUser.id },
      });
  
      // Renderiza la vista con los datos obtenidos
      res.render('user/historialReservacion', {
         historialReservaciones,
          loggedUser,
          showHeader: true
         });
    } catch (error) {
      console.error('Error al obtener el historial de reservaciones:', error.message);
    }
  };

  const eliminarReserva = async (req, res) => {
    const reservacionId = req.params.id;
  
    try {
      // Lógica para eliminar la reserva según el ID
      await Reservaciones.destroy({
        where: { id: reservacionId }
      });
  
      // Envía una respuesta exitosa
      res.render('templates/msgUser.pug',{
        page:"Eliminacion correcta",
        button:"Volver a Mis reservas",
        error: false,
        msg:"Se ha eliminado el registro correctamente"
     })
    } catch (error) {
      console.error('Error al eliminar la reservación:', error.message);
      res.status(500).json({ error: 'Error al eliminar la reservación' });
    }
  };
  
  const mostrarTicket = (req, res) => {
    // Puedes obtener la información necesaria para el ticket desde la base de datos u otras fuentes.
    const ticketData = obtenerInformacionDelTicketSegunNecesidad();
  
    // Renderizar la vista de ticket
    res.render('public/ticket', { ticketData });
  };


  


export { eliminarReserva,userHome,historial, saveReservation, reservacion, formLogin, formRegister, formPasswordRecovery, formPasswordUpdate, insertUser, confirmAccount, updatePassword, emailChangePassword, mostrarTicket};
