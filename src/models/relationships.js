import User from './user.js';
import reservation from './rooms.js'
import Rooms from './rooms.js';


User.hasMany(reservation,{ // Un usuario puede tener muchas reservaciones
    foreignKey: 'user_ID'
}), //ForeingKey

Rooms.hasOne(User,{ // Una habitación puede tener un usuario
    foreignKey: 'user_ID'
}) //ForeingKey

export{User, reservation, Rooms}