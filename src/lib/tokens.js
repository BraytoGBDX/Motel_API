import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({
    path:'src/.env'
});

// Token propio
const generateToken = () =>Math.random().toString(32).substring(3)+Date.now().toString(32)+Math.random().toString(32).substring(3); //* numero aleatorio, fecha, numero aleatorio
//  jwtoken
const generateJwt = (userID) =>
        jwt.sign({
        domain: process.env.JWT_DOMAIN,
        signature: process.env.JWT_SIGNATURE,
        author: process.env.JWT_AUTHOR,
        year: process.env.JWT_YEAR,
        userID
    },process.env.JWT_SECRET_HASH_STRING,{
        expiresIn:'1d'
    })

//module.exports(generateToken);
export{
    generateToken, generateJwt
}