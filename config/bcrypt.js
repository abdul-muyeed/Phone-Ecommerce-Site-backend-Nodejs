const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT))
    const hash = await bcrypt.hash(password, salt)
    return hash

    } catch(err){
        console.log("hasing error: ", err);
    }
    
}

module.exports = hashPassword;