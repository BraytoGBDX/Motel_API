import User from './user.js';
import Rooms from './rooms.js'


Rooms.belongsTo(User,{
    foreignKey: 'user_ID'
}) //ForeingKey

export{User, Rooms}