import {exit} from 'node:process'
import rooms from '../../models/rooms.js'
import Rooms from './roomsSeed.js'
import db from '../../config/db.js'
import reservatio from '../models/reservatio.js'
import Reservation from '../reservationSeed.js'


const importData = async () => {
    try{
        //Autenticar
        await db.authenticate()
        //Generar columnas
        await db.sync()
        //Importar los datos
        await Promise.all([ Rooms.bulkCreate(rooms), Reservation.bulkCreate(reservatio)])
        console.log(`Se han importado los datos de las tablas catalogo de manera correcta`);
        exit
    }catch(err){
        console.log(err)
        exit(1);
    }
                /////////FALTA COMPLETAR LA EXPORTACION Y MODIFICACION DE LA TABLA RESERVATION///////////////////
}

if(process.argv[2] === "-i"){
    importData();
}

const deleteData = async () => {
    try{
        const queryResetRooms = "ALTER TABLE tbc_rooms AUTO_INCREMENT = 1;"     
        await Promise.all([Rooms.destroy({
            where:{},
            truncate:false
        })
       ])

        await Promise.all([
            db.query(queryResetRooms,{
            raw:true
            
        })
      ])
    }catch(err){
        console.log(err)
            exit(1);
    }
}

if(process.argv[2] === "-d"){
    deleteData();
}
//0 node, 1 seeder, 2 argumento