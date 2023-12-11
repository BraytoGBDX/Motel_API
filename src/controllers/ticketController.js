// controllers/ticketController.js
import QRCode from 'qrcode';

const generarTicketYPago = async (monto, referencia, nombre, email) => {
  try {
    // Lógica para generar el código QR con información dinámica
    const qrData = `Monto: ${monto}, Referencia: ${referencia}, Nombre: ${nombre}, Email: ${email}`;
    const codigoQrBase64 = await QRCode.toDataURL(qrData);

    // Otros detalles del ticket
    const ticketData = {
      monto,
      referencia,
      nombre,
      email,
      codigoQrBase64,
    };

    return ticketData;
  } catch (error) {
    console.error('Error al generar el código QR:', error);
    throw error;
  }
};

export { generarTicketYPago };
