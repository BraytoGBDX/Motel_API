import {exit} from 'node:process'
import rooms from '../../models/rooms.js'
import Rooms from './roomsSeed.js'
import db from '../../config/db.js'



const importData = async () => {
    try{
        //Autenticar
        await db.authenticate()
        //Generar columnas
        await db.sync()
        //Importar los datos
        await Promise.all([ Rooms.bulkCreate(rooms)])
        console.log(`Se han importado los datos de las tablas catalogo de manera correcta`);
        exit
    }catch(err){
        console.log(err)
        exit(1);
    }

}

if(process.argv[2] === "-i"){
    importData();
}

const deleteData = async () => {
    try{
        const queryResetRooms = "ALTER TABLE tbc_categories AUTO_INCREMENT = 1;"     
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