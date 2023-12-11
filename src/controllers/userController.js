import User from "../models/user.js";
import { check, validationResult } from "express-validator";
import { generateToken, generateJwt } from "../lib/tokens.js";
import bcrypt from 'bcrypt';
import { emailRegister, emailPasswordRecovery } from "../lib/emails.js";
import  jsonWebToken  from "jsonwebtoken";
import Reservaciones from "../models/reservaciones.js";
import Rooms from "../models/rooms.js";
import path from 'path';
import QRCode from 'qrcode';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

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

  // controllers/ticketController.js

  function generarReferenciaToken() {
    const referenciaAleatoria = crypto.randomBytes(16).toString('hex');
    return referenciaAleatoria;
  }

const generarTicketYPago = async (monto, referencia, nombre, email) => {
  try {
    // Lógica para generar el código QR con información dinámica
    const qrData = `Monto: ${monto}, Referencia: ${referencia}, Nombre: ${nombre}, Email: ${email}`;
    const codigoQrBase64 = await QRCode.toDataURL(qrData);

    // Otros detalles del ticket
    const ticketData = {
      monto,
      referencia,
      nombre,
      email,
      codigoQrBase64,
    };

    return ticketData;
  } catch (error) {
    console.error('Error al generar el código QR:', error);
    throw error;
  }
};


const saveReservation = async (req, res) => {
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
    const loggedUser = await User.findByPk(decoded.userID);
    const { tipoReserva, fecha, hora, tipoHabitacion } = req.body;
  
    try {
      const habitacionDisponible = await Rooms.findOne({
        where: {
          type: String(tipoHabitacion),
          status: 1,
        },
      });
  
      if (habitacionDisponible) {
        // Obtener el precio de la habitación
        const precioHabitacion = habitacionDisponible.price;
  
        // Crear la referencia y el código QR
        const referencia = generarReferenciaToken();
        const codigoQrBase64 = await generarCodigoQR(referencia);
  
        // Crear la reserva
        const reservacion = await Reservaciones.create({
          tipoReserva: tipoReserva,
          fecha: fecha,
          hora: hora,
          user_ID: loggedUser.id,
          room_ID: habitacionDisponible.id,
          monto: precioHabitacion,
          referencia: referencia,
          codigoQrBase64: codigoQrBase64,
        });
  
        // Actualizar el estado de la habitación
        habitacionDisponible.status = 0;
        habitacionDisponible.save();
  
        console.log(`Habitación reservada: ${habitacionDisponible.id}`);
  
        // Generar el ticket con el precio de la habitación
        const ticketData = await generarTicketYPago(precioHabitacion, referencia, loggedUser.nombre, loggedUser.email);
  
        res.render('user/ticket', {
          ticketData,
          showHeader: true,
        });

        setTimeout(async () => {
            habitacionDisponible.status = 1;
            habitacionDisponible.save();
            console.log(`Estado de la habitación restaurado: ${habitacionDisponible.id}`);
          }, 180000);
      } else {
        res.render('templates/msgUser.pug', {
          page: "Ups...Lo sentimos",
          button: "Volver al inicio",
          error: true,
          msg: "Por el momento no hay habitaciones disponibles",
        });
      }
    } catch (error) {
      console.error('Error al guardar la reservación:', error.message);
    }
  };
  
  async function generarCodigoQR(texto) {
    try {
        // Configurar las opciones del código QR según tus necesidades
        const opcionesQR = {
          type: 'image/png', // Puedes ajustar el tipo de imagen según tus necesidades
          quality: 0.9, // Puedes ajustar la calidad de la imagen
          margin: 1,
        };
    
        // Generar un nombre único para el archivo de imagen
        const nombreImagen = `${uuidv4()}.png`;
    
        // Obtener la ruta completa para el archivo de imagen
        const rutaDirectorio = './src/public/img/qr/';
        const rutaImagenQR = path.join(rutaDirectorio, nombreImagen); // Ajusta la ruta según tus necesidades
    
        // Verificar si el directorio existe, si no, créalo
        await fs.mkdir(rutaDirectorio, { recursive: true });
    
        // Generar el código QR como un buffer
        const qrBuffer = await QRCode.toBuffer(texto, opcionesQR);
    
        // Guardar el buffer como un archivo de imagen
        await fs.writeFile(rutaImagenQR, qrBuffer);
    
        return rutaImagenQR;
      } catch (error) {
        console.error('Error al generar el código QR como imagen:', error);
        throw error;
      }
  }
  



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
    const ticketData = obtenerInformacionDelTicketSegunNecesidad();
      res.render('public/ticket', { ticketData });
  };


  


export { eliminarReserva,userHome,historial, saveReservation, reservacion, formLogin, formRegister, formPasswordRecovery, formPasswordUpdate, insertUser, confirmAccount, updatePassword, emailChangePassword, mostrarTicket};
