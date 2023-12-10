import bcrypt from 'bcrypt'
const admin = [
    {
        name: "Administrador",
        email: "lculpa45@gmail.com",
        password: bcrypt.hashSync('Okumura rin23', 10),
        verified: 1,
        type: "admin"
    }
]

export default admin