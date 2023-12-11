import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({
    path:'src/.env'
});

const db = new Sequelize (process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{   
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect:'mysql',
    timezone: '-06:00',
    define:{
        Timestamps: true
    },
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        iddle: 10000

    },
    operatorAliases:false
});


export default db;