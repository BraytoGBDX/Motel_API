import WorkerCode from "../../models/workerCode";
import workerCodesData from './workerCodeSeed.js'

const seedWorkerCodes = async () => {
    try {
      // Sincroniza el modelo con la base de datos
      await WorkerCode.sync({ force: true });
  
      // Inserta los datos de ejemplo
      await WorkerCode.bulkCreate(workerCodesData);
  
      console.log('Datos de WorkerCode insertados correctamente.');
    } catch (error) {
      console.error('Error al insertar datos de WorkerCode:', error);
    } finally {
      // Cierra la conexión con la base de datos si es necesario
      await WorkerCode.sequelize.close();
    }
  };
  

  if(process.argv[2]==="-i"){
    seedWorkerCodes();
}
  // Llama a la función para ejecutar el seeder
  