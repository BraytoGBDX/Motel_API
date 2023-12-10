import { DataTypes } from "sequelize"
import db from '../config/db.js'

const Reservaciones = db.define('tbd_resevaciones',{
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        primaryKey: true
    },
    tipoReserva: { //* tipo de habitación
        type: DataTypes.ENUM('publica','anonima'),
        allowNull: false
    },
    fecha: { //* Descripcion
        type: DataTypes.DATE,
        allowNull: false
    },
    hora:{ //* Imagen
        type: DataTypes.STRING(),
        allowNull: false,
    },
    codigo: {    //* precio de habitacones 
        type: DataTypes.STRING(),
        allowNull: false,
        defaultValue:"Por definir" 
    }
})

export default Reservaciones