import { DataType, DataTypes } from "sequelize"
import db from '../config/db.js'

const Rooms = db.define('tbc_rooms',{
    
    user_ID: { //* tipo de habitación
        type: DataTypes.STRING(20),
        allowNull: false
    },
    rooms_ID: { //* Descripcion
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {    //* precio de habitacones 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0   
    },
    image:{ //* Imagen
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: "Por definir"
    },
    type :{
        type: DataType.ENUM("anonimo","publico"),
    }
})

export default Rooms