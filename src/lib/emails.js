import dotenv from 'dotenv';
dotenv.config({
  path: 'src/.env'
})
import nodemailer from 'nodemailer';
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailRegister = async (userData) => {
  const { name, email, token } = userData
  console.log(`Intentando enviar un correo electronico de activación al usuario ${email}`)
  //* ENVIANDO  EL  CORREO 
  await transport.sendMail({
    from: 'caritogold15@gmail.com', //Emitente
    to: email, //Destinatario
    subject: "Motel dos Caminos: Verificar tu cuenta.", //Asunto
    text: "Bienvenido a Motel dos Caminos, para continuar es obligatorio hacer click en el enlace a continuación para activar su cuenta..", //Cuerpo
    html:
      `<html>
      <head>
        <style>
            body {
              font-family: sans-serif;
              margin: 0;
              padding: 0;
              background: #c06500;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 15px; /* Esquinas redondeadas */
              overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
              
          }

          header {
              text-align: center;
              background-color: #853400;
              color: #ffffff;
              padding: 10px; /* Ajusta el relleno según tus necesidades */
              display: flex;
              justify-content: space-between; /* Alinea los elementos al inicio y al final del encabezado */
              align-items: center; /* Centra verticalmente los elementos del encabezado */
              border-radius: 15px; /* Esquinas redondeadas */
              overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
          }

          h1 {
              font-size: 28px;
              font-weight: bold;
              color: #853400;
              text-align: center;
              margin: 20px 0;
          }

          .small-image {
              width: 100px; /* ajusta el tamaño según tus necesidades */
              height: auto; /* mantiene la proporción original */
              margin-right: 20px; /* Agrega un margen derecho para separar la imagen del borde del encabezado*/
          }


          span {
              font-size: 18px;
              font-weight: normal;
              color: #000000;
          }

          p {
              font-size: 14px;
              color: #000000;
              text-align: justify;
              margin: 10px 0;
          }

          a {
              display: block;
              width: 200px;
              margin: 0 auto;
              background-color: #f1c755;
              color: #ffffff;
              padding: 10px 20px;
              text-align: center;
              font-size: 16px;
              text-decoration: none;
              margin-top: 20px;
          }

          footer {
              text-align: center;
              background-color: #853400;
              color: #ffffff;
              padding: 10px 0;
              border-radius: 15px; /* Esquinas redondeadas */
              overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
          }

          .signature {
              font-size: 14px;
              text-align: left;
              margin: 20px 0;
          }

          .button{
              border-radius: 15px; /* Esquinas redondeadas */
              overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
          }
  
          .resaltado {
      color: red;
      font-weight: bold;
      
      
  }
  
        </style>
      </head>
      <body>
        <div class="container">
        <header style="display: flex; justify-content: space-between; align-items: center;">
  <div style="display: flex; align-items: center;">
  <h1 style="font-size: 32px; font-weight: bold; color: white;">Motel Dos Caminos</h1>
  </div>
  <div>
  <img class="small-image" src="MotelLogo.png" alt="">
  </div>
  </header>
  
  
          <fieldset>
            <legend align="center" style="font-size: 25px;">Nueva cuenta</legend>
      
          <p style="font-size: 18px; margin-top: 20px;">Bienvenido a la pagina del Motel Dos Caminos, ${name}!</p>
          <p>Gracias por elegir a nuetro Motel. Para continuar usando nuestra plataforma, haga clic en el enlace a continuacion para activar su cuenta.:</p>
          <a href="http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/user/confirm/${token}">Activa tu cuenta</a>
          <p>Atentamente....</p>
          <div class="signature">
          <p style="text-align: center;">CBA</p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Firmas_cover.png" alt="Firma" style="display: block; margin: auto; width: 100px; height: auto;">
          <p style="text-align: center;">Administradores del hotel</p>
          </div>
          <p> <spam class="resaltado"><em>* Si no solicitaste crear una cuenta, por favor ignora este correo..</em></spam></p>
          <footer>
            &copy; Motel Dos Caminos
          </footer>
  
        </div>
      </fieldset>
      </body>
    </html>`

  })
}

const emailPasswordRecovery = async (userData) => {
  const { name, email, token } = userData
  console.log(`Intentando enviar un correo electronico dpara la recuperación de cuenta del usuario: ${email}`)
  //* ENVIANDO  EL  CORREO 
  await transport.sendMail({
    from: 'caritogold17@gmail.com', //Emitente
    to: email, //Destinatario
    subject: "Motel Dos Caminos - Recuperacion de Contrase", //Asunto
    text: "Welcome to RealState-220627, to continue is mandatory that yout click on link below to activate your account.", //Cuerpo
    html:
      `<html>
      <head>
          <style>
          body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
            background: #c06500;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 15px; /* Esquinas redondeadas */
            overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
            
        }

        header {
            text-align: center;
            background-color: #853400;
            color: #ffffff;
            padding: 10px; /* Ajusta el relleno según tus necesidades */
            display: flex;
            justify-content: space-between; /* Alinea los elementos al inicio y al final del encabezado */
            align-items: center; /* Centra verticalmente los elementos del encabezado */
            border-radius: 15px; /* Esquinas redondeadas */
            overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
        }

        h1 {
            font-size: 28px;
            font-weight: bold;
            color: #853400;
            text-align: center;
            margin: 20px 0;
        }

        .small-image {
            width: 100px; /* ajusta el tamaño según tus necesidades */
            height: auto; /* mantiene la proporción original */
            margin-right: 20px; /* Agrega un margen derecho para separar la imagen del borde del encabezado*/
        }


        span {
            font-size: 18px;
            font-weight: normal;
            color: #000000;
        }

        p {
            font-size: 14px;
            color: #000000;
            text-align: justify;
            margin: 10px 0;
        }

        a {
            display: block;
            width: 200px;
            margin: 0 auto;
            background-color: #f1c755;
            color: #ffffff;
            padding: 10px 20px;
            text-align: center;
            font-size: 16px;
            text-decoration: none;
            margin-top: 20px;
        }

        footer {
            text-align: center;
            background-color: #853400;
            color: #ffffff;
            padding: 10px 0;
            border-radius: 15px; /* Esquinas redondeadas */
            overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
        }

        .signature {
            font-size: 14px;
            text-align: left;
            margin: 20px 0;
        }

        .button{
            border-radius: 15px; /* Esquinas redondeadas */
            overflow: hidden; /* Asegura que las esquinas redondeadas se apliquen correctamente */
        }
              
          </style>
      </head>
      <body><br>
          <div class="container">
              <header>
                <img class="small-image" src="MotelLogo.png" alt="">
                <p style="font-size: 50px; color: white;">Motel Dos Caminos</p>
              </header>
              <p>Bienvenido a Motel Dos Caminos, ${name}.</p>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Para continuar con el proceso de recuperación de contraseña, haz clic en el siguiente enlace:</p>
              <a href="http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/user/update-password/${token}" class="button">Restablecer la contraseña</a>
              <p>Atentamente....</p>
              <div class="signature">
                  <p style="text-align: center;">CBA</p>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Firmas_cover.png" alt="Firma" style="display: block; margin: auto; width: 100px; height: auto;">
                  <p style="text-align: center;">Administradores del hotel</p>
              </div>
              <p>* Si no solicitaste este restablecimiento de contraseña, por favor ignora este correo.</p>
              <footer>
                  &copy; Motel dos Caminos
              </footer>
          </div>
      </body>
  </html>`

  })
}





export { emailRegister, emailPasswordRecovery }

