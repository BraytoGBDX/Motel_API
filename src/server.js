import express, { urlencoded } from 'express';
import userRoutes from './routes/userRoutes.js';
import publicRoutes from './routes/publicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import db from './config/db.js';
import helmet from 'helmet'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import {User, Reservaciones} from './models/relationships.js'




dotenv.config({
    path:'src/.env'
})



//*Instanciamos el modulo
const app = express();



app.use(express.urlencoded({
    extended:false 
}));

app.use(morgan('dev'));




app.use(methodOverride('_method'));

// HABILITAR COOKIEPARSER PARA LEER, ESCRIBIR Y ELIMINAR EN LAS COOKIES DEL NAVEGADOR.
app.use(cookieParser(process.env.COOKIE_SECRET, {
    cookie: true
}));



//TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', './src/views');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('src/public'));

// HABILITAR LA PROTECCION A TRAVES DE HELMET
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://unpkg.com', 'https://cdnjs.cloudflare.com', "'unsafe-eval'"],
      styleSrc: ["'self'", 'https://unpkg.com', 'https://cloudflare.com', 'https://cdnjs.cloudflare.com'],
      imgSrc: ["'self'", 'data:', 'https://unpkg.com', 'https://cloudflare.com', 'https://cdnjs.cloudflare.com', 'https://a.tile.openstreetmap.org', 'https://b.tile.openstreetmap.org', 'https://c.tile.openstreetmap.org'],
      connectSrc: ["'self'", 'https://tile-provider-domain.com', 'https://geocode.arcgis.com'],
    },
  }));

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
