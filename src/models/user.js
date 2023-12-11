import { DataTypes } from 'sequelize';
import db from '../config/db.js';

import bcrypt from 'bcrypt';

//* Modelo de la tabla users
const User = db.define('tbb_users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    unique: false,
    defaultValue: '',
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  type: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
  },
});

User.prototype.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};



export default User
