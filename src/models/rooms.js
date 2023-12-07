import { DataType, DataTypes } from "sequelize"
import db from '../config/db.js'

const Rooms = db.define('tbc_rooms',{
    
    typeRoom: { //* tipo de habitación
        type: DataTypes.STRING(20),
        allowNull: false
    },
    description: { //* Descripcion
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {    //* precio de habitacones 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0   
    },
    disponibilidad: {

    },
    image:{ //* Imagen
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: "Por definir"
    }
})

export default Rooms