// controllers/adminController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

const formRegisterAdmin = (request, response) => {

    response.render("../views/auth/registerAdmin.pug", {
        isLogged: false,
        page: "Admin Resgister",

    })
}

const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el administrador ya existe
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'El administrador ya existe.' });
    }
    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear un nuevo administrador
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });
    // Generar un token de autenticación
    const token = jwt.sign({ adminId: newAdmin.id }, 'tu_secreto', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export {registerAdmin, formRegisterAdmin}

