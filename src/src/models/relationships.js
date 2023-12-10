import User from './user.js';
import Reservaciones from './reservaciones.js'
import Rooms from './rooms.js'

Reservaciones.belongsTo(User,{
    foreignKey: 'user_ID'
}) //ForeingKey


Rooms.hasOne(Reservaciones, {
    foreignKey:'room_ID'
})

export{User, Reservaciones}