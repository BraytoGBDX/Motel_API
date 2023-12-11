import dotenv from 'dotenv';
dotenv.config({
    path:'src/.env'
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
  const {name, email, token} = userData
    console.log(`Intentando enviar un correo electronico de activación al usuario ${email}`)
    //* ENVIANDO  EL  CORREO 
    await transport.sendMail({
      from:'CBA@utxicotepec.edu.mx', //Emitente
      to:email, //Destinatario
      subject: "Model Dos Caminos: Verificación.", //Asunto
      text:"Bienvenido a Motel Dos Caminos para continuar usando la plataforma por favor haz click en el boton de abajo para validar tu cuenta.", //Cuerpo
      html:
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #FFB183;
            font-size: 16px;
          }
      
          header {
            background-color: #FF6600;
            color: #FFF;
            padding: 20px;
            text-align: center;
          }
      
          h1 {
            font-size: 36px;
            font-weight: bold;
            color: #481968;
            margin: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #FCD4A0;
            border-radius: 8px;
          }
      
          p {
            font-size: 18px;
            color: #333;
            text-align: justify;
            margin: 10px 0;
          }
      
          a {
            display: block;
            background-color: #FF3333;
            color: #FFF;
            border-radius: 5px;
            padding: 15px 20px;
            text-align: center;
            font-size: 18px;
            text-decoration: none;
            margin-top: 20px;
          }
      
          a:hover {
            background-color: #FF6666;
            box-shadow: 2px 2px 2px #000;
          }
      
          .signature {
            text-align: right;
            margin-top: 20px;
            color: blue;
            font-weight: bold;
          }
      
          img {
            width: 150px;
            height: auto;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Motel<span style="font-size: 24px;">Dos Caminos</span></h1>
        </header>
        <div class="container">
          <legend align="center">Confirm Account</legend>
          <p>Bienvenido a Motel Dos Caminos, ${name}!</p>
          <p>Bienvenido nuevo usuario, para activar tu cuenta por favor haz click en el boton de abajo:</p>
          <a href="http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/user/confirm/${token}">Activate Your Account</a>
          <div class="signature">
            <p>Motel Dos Caminos</p>
            <a href='https://postimg.cc/w1nFVqS3' target='_blank'><img src='https://i.postimg.cc/w1nFVqS3/Firma.png' border='0' alt='Firma'/></a>
          </div>
        </div>
      </body>
      </html>
      `

    })
}

const emailPasswordRecovery = async (userData) => {
  const {name, email, token} = userData
    console.log(`Intentando enviar un correo electronico dpara la recuperación de cuenta del usuario: ${email}`)
    //* ENVIANDO  EL  CORREO 
    await transport.sendMail({
      from:'CBA@utxicotepec.edu.mx', //Emitente
      to:email, //Destinatario
      subject: "Motel Dos Caminos: Recuperar contraseña.", //Asunto
      text:"Para actualizar tu contraseña por favor da click en el boton de abajo.", //Cuerpo
      html:
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #FFB183;
            font-size: 16px;
          }
      
          header {
            background-color: #FF6600;
            color: #FFF;
            padding: 20px;
            text-align: center;
          }
      
          h1 {
            font-size: 36px;
            font-weight: bold;
            color: #481968;
            margin: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #FCD4A0;
            border-radius: 8px;
          }
      
          p {
            font-size: 18px;
            color: #333;
            text-align: justify;
            margin: 10px 0;
          }
      
          a {
            display: block;
            background-color: #FF3333;
            color: #FFF;
            border-radius: 5px;
            padding: 15px 20px;
            text-align: center;
            font-size: 18px;
            text-decoration: none;
            margin-top: 20px;
          }
      
          a:hover {
            background-color: #FF6666;
            box-shadow: 2px 2px 2px #000;
          }
      
          .signature {
            text-align: right;
            margin-top: 20px;
            color: blue;
            font-weight: bold;
          }
      
          img {
            width: 150px;
            height: auto;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Motel<span style="font-size: 24px;">Dos Caminos</span></h1>
        </header>
        <div class="container">
          <legend align="center">Cambio de contraseña</legend>
          <p>Bienvenido a Motel Dos Caminos, ${name}!</p>
          <p>Estimado usuario para restablecer la contraseña por favor haz click en el boton de abajo:</p>
          <a href="http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/user/update-password/${token}">Recovery your password</a>
          <div class="signature">
            <p>Motel Dos Caminos</p>
            <a href='https://postimg.cc/w1nFVqS3' target='_blank'><img src='https://i.postimg.cc/w1nFVqS3/Firma.png' border='0' alt='Firma'/></a>
          </div>
        </div>
      </body>
      </html>
      `

    })
}

export const sendQRCodeEmail = async ({ name, email, codigoQrBase64 }) => {
  console.log(`Intentando enviar un correo electrónico con el código QR al usuario ${email}`);
  // ENVIANDO EL CORREO
  await transport.sendMail({
      from: 'CBA@utxicotepec.edu.mx', // Emitente
      to: email, // Destinatario
      subject: 'Código QR de Reserva', // Asunto
      html: `
          <p>Hola ${name},</p>
          <p>Tu reserva ha sido confirmada. Aquí está tu código QR:</p>
          <img src="cid:codigoQr" alt="Código QR" />
          <p>Gracias por usar nuestra aplicación.</p>
      `,
      attachments: [
          {
              filename: 'codigo-qr.png',
              content: codigoQrBase64,
              encoding: 'base64',
              cid: 'codigoQr',
          },
      ],
  });
};



export { emailRegister, emailPasswordRecovery }
