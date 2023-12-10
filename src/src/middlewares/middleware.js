import JsonWebToken from "jsonwebtoken";
import dotenv from 'dotenv';
import User from '../models/user.js'
dotenv.config({
    path:'src/.env'
});

const protectRoute = async (req,res, next) =>{
    const {_token}=req.cookies

    if(!_token){
        return res.redirect('/login')
    }

    try {
        const decoded = JsonWebToken.verify(_token, process.env.JWT_SECRET_HASH_STRING)
        const loggedUser= await User.findByPk(decoded.userID)
        console.log(loggedUser)

        if(loggedUser){
            req.user = loggedUser
        }
    } catch (error) {
        console.log(error)
    }

}

export default protectRoute