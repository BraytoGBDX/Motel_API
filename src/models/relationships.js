import User from './user.js';
import Reservaciones from './reservaciones.js';
import Rooms from './rooms.js';

// Relación entre Reservaciones y User
Reservaciones.belongsTo(User, {
  foreignKey: 'user_ID',
});



// Relación entre Rooms y Reservaciones
Rooms.hasOne(Reservaciones, {
    foreignKey: 'room_ID',
  });

export { User, Reservaciones, Rooms };
