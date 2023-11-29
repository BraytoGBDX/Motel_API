

const adminHome=(req,res) =>{
    res.render('../views/admin/adminHome.pug',{
        isLogged: true,
        page:"Admin"
    })
  }

  export {adminHome}