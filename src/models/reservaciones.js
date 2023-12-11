// models/relationships.js

import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Reservaciones = db.define('tbd_reservaciones', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  tipoReserva: {
    type: DataTypes.ENUM('publica', 'anonima'),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING(),
    allowNull: false,
    defaultValue: "Por definir"
  },
  monto: { // Nuevo campo para almacenar el monto del ticket
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  referencia: { // Nuevo campo para almacenar la referencia del ticket
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigoQrBase64: { // Nuevo campo para almacenar el código QR en base64
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

export default Reservaciones;
