import User from "../models/user.js";
import Rooms from '../models/rooms.js';
import Reservaciones from "../models/reservaciones.js"

import  jsonWebToken  from "jsonwebtoken";


const adminHome= async(req,res) =>{
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING)
    const loggedUser = await User.findByPk(decoded.userID)
    res.render('admin/adminHome',{
        showHeader: true,
        isLogged: true,
        page:"Admin",
        loggedUser
    })
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



  export {adminHome,roomsview,reservasview}