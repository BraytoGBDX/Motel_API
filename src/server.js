import express, { urlencoded } from 'express';
import userRoutes from './routes/userRoutes.js';
import publicRoutes from './routes/publicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import db from './config/db.js';
import helmet from 'helmet'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import propertyRoutes from './routes/propertyRoutes.js'




dotenv.config({
    path:'src/.env'
})

//*Instanciamos el modulo
const app = express();
app.use(express.urlencoded({
    extended:false 
}));

// HABILITAR COOKIEPARSER PARA LEER, ESCRIBIR Y ELIMINAR EN LAS COOKIES DEL NAVEGADOR.
const secretKey = 'tu_clave_secreta_aqui'; // Cambia esto por una clave segura
app.use(cookieParser(secretKey));

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
}));


//TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(express.static('./src/public'));

// HABILITAR LA PROTECCION A TRAVES DE HELMET
app.use(helmet());

app.listen(process.env.SERVER_PORT, (request, response) => {
    console.log(`EL servicio HTTP ha sido iniciado... \n  El servicio esta escuchando por el puerto: ${process.env.SERVER_PORT}`)
});

try{
   await  db.authenticate();
    console.log("La conexion a la base de datos ha sido exitosa");
    db.sync();
    console.log("Se ha sincronizado las tablas existentes en la base de datos")
}
catch{
    console.log("Ocurrio un error al intentar conectarse a la base de datos :c ");
    
}

app.use('/user', userRoutes);
app.use('/', publicRoutes)
app.use('/admin', adminRoutes)
