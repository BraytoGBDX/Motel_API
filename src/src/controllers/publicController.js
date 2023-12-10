import { check, validationResult } from "express-validator";
import { generateJwt} from "../lib/tokens.js"
import User from "../models/user.js";


const formLogin = (request, response) => {

    response.render("../views/auth/login.pug", {
        isLogged: false,
        page: "Login",

    })
}





const publicHome = (req, res) => {
    
    res.render('templates/publicHome.pug');
  
}

const validateUser = async (req, res) => {
    try {
      await check("email").notEmpty().withMessage("Email field is required").isEmail().withMessage("This is not in email format").run(req);
      await check("password").notEmpty().withMessage("Password field is required").isLength({ max: 20, min: 8 }).withMessage("Password must contain between 8 and 20 characters").run(req);
  
      let resultValidation = validationResult(req);
  

      if (resultValidation.isEmpty()) {
        const { email, password } = req.body;
        console.log(`El usuario: ${email} está intentando acceder a la plataforma`);
        const userExists = await User.findOne({ where: { email } });
        const token = generateJwt(userExists.id);

        if (userExists.type == 'admin') {
          console.log("El admin existe");

          // const token = generateJwt(userExists.id);
                    res.cookie('_token', token, {
                        httpOnly: true,
                    }).redirect('admin/adminHome');
        
        
        
        } else if (userExists.type == 'user') {
          console.log("El usuario existe");
          if (userExists.verified) {
            console.log("El usuario existe y está verificado");
            if (userExists.verifyPassword(password)) {
              console.log("La contraseña coincide");
              // const token = generateJwt(userExists.id);
                    res.cookie('_token', token, {
                        httpOnly: true,
                    }).redirect('user/userHome');


            } else {
              res.render("auth/login.pug", {
                page: "Login",
                errors: [{ msg: `User and password do not match` }],
                user: { email }
              });
            }
          } else {
            console.log("Existe, pero no está verificado");
            res.render("auth/login.pug", {
              page: "Login",
              errors: [{ msg: `The user associated to: ${email} was found but not verified` }],
              user: { email }
            });
          }
        } else {
          console.log("El usuario no existe");
          res.render("auth/login.pug", {
            page: "Login",
            errors: [{ msg: `The user associated to: ${email} was not found` }],
            user: { email }
          });
        }
      } else {
        res.render("auth/login.pug", {
          page: "Login",
          errors: resultValidation.array(),
          user: {
            email: req.body.email
          }
        });
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
    }
  };

  const logout = (req,res) => {
    res.clearCookie('_token')
    res.redirect('/')
  }
  

export {formLogin, publicHome, validateUser, logout}