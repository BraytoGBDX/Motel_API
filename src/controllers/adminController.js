import User from "../models/user.js";
import Rooms from '../models/rooms.js';
import Reservaciones from "../models/reservaciones.js"

import  jsonWebToken  from "jsonwebtoken";


const adminHome= async(req,res) =>{
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING)
    const loggedUser = await User.findByPk(decoded.userID)

    try {
      // Obtén todos los usuarios de la base de datos
      const users = await User.findAll();
      res.render('admin/adminHome',{
        showHeader: true,
        isLogged: true,
        page:"Admin",
        loggedUser,
        users
    })
  
      // Renderiza la vista con los datos de los usuarios
    } catch (error) {
      console.error('Error al obtener los usuarios:', error.message);
      res.status(500).send('Error interno del servidor');
    }
    

    // Importa el modelo de usuario

  
  }

  // adminController.js
  
const roomsview = async (req, res) => {
  try {
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING)
    const loggedUser = await User.findByPk(decoded.userID)
    const rooms = await Rooms.findAll();
    res.render('admin/rooms', {  showHeader: true,
        isLogged: true,
        page:"Admin",
        loggedUser,
         rooms });
  } catch (error) {
    console.error('Error al obtener las habitaciones:', error.message);
    res.status(500).send('Error interno del servidor');
  }
};



const reservasview = async (req, res) => {
  try {
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING)
    const loggedUser = await User.findByPk(decoded.userID)
    const reservacions = await Reservaciones.findAll();
    res.render('admin/reservas', {  showHeader: true,
        isLogged: true,
        page:"Admin",
        loggedUser,
         reservacions });
  } catch (error) {
    console.error('Error al obtener las habitaciones:', error.message);
    res.status(500).send('Error interno del servidor');
  }
};



// Ruta para la página de edición de precios
const editRooms = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Rooms.findByPk(roomId);

    if (!room) {
      return res.status(404).render('templates/error.pug', {
        page: 'Habitación no encontrada',
        error: 'La habitación que estás intentando editar no existe.',
      });
    }

    res.render('admin/editRooms.pug', {
       room 
      });
  } catch (error) {
    // Maneja los errores de manera adecuada
    console.error('Error al cargar la página de edición de precio:', error);
    res.status(500).render('templates/error.pug', {
      page: 'Error del servidor',
      error: 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
    });
  }
};

const updateRooms = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const newPrice = req.body.newPrice;
    const newStatus = req.body.newStatus; // Nuevo campo para el estado de la habitación

    await Rooms.update(
      { 
        price: newPrice,
        status: newStatus,
      }, 
      { 
        where: { id: roomId } 
      }
    );

    res.redirect('/admin/rooms');
  } catch (error) {
    console.error('Error al editar la habitación:', error);
    res.status(500).render('templates/error.pug', {
      page: 'Error del servidor',
      error: 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
    });
  }
};



const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { newType, newVerified } = req.body;

    // Obtiene el usuario por ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).render('templates/error.pug', {
        page: 'Usuario no encontrado',
        error: 'El usuario que estás intentando editar no existe.',
      });
    }

    // Actualiza el tipo y el verificado del usuario
    user.type = newType;
    user.verified = newVerified;

    // Si se está cambiando a verificado y existe un token, elimina el token
    if (newVerified === 1 && user.token) {
      user.token = null;
    }

    // Guarda los cambios en la base de datos
    await user.save();

    // Redirecciona a la página de control de usuarios o a otra página que desees
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error al editar el usuario:', error);
    res.status(500).render('templates/error.pug', {
      page: 'Error del servidor',
      error: 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
    });
  }
};

// En tu archivo de controladores (adminController.js)
const editUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Obtener los detalles del usuario según el userId
    const user = await User.findByPk(userId);

    if (!user) {
      // Manejar el caso en que el usuario no se encuentre
      return res.status(404).render('templates/error.pug', {
        page: 'Usuario no encontrado',
        error: 'El usuario que estás intentando editar no existe.',
      });
    }

    // Renderizar la página de edición de usuario con la información del usuario
    res.render('admin/editUser.pug', { user });
  } catch (error) {
    // Manejar errores de manera adecuada
    console.error('Error al cargar la página de edición de usuario:', error);
    res.status(500).render('templates/error.pug', {
      page: 'Error del servidor',
      error: 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
    });
  }
};






  export {adminHome,roomsview,reservasview, editRooms, updateRooms, updateUser, editUser}