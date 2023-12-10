import User from "../models/user.js";
import  jsonWebToken  from "jsonwebtoken";


const adminHome= async(req,res) =>{
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING)
    const loggedUser = await User.findByPk(decoded.userID)
    res.render('admin/adminHome',{
        showHeader: true,
        isLogged: true,
        page:"User",
        loggedUser
    })
  }

  export {adminHome}