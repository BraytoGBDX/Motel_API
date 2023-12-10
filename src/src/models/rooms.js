import {  DataTypes } from "sequelize"
import db from '../config/db.js'

const Rooms = db.define('tbc_rooms',{
    name:{
        type:DataTypes.STRING(20),
        allowNull:false,
    },
    type: { 
        type: DataTypes.ENUM('Estandar','Suit'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status:{ 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    price: {    
        type: DataTypes.FLOAT,
        allowNull: false,
    }
})

export default Rooms