const mongoose = require('mongoose')

    const userSchema = new mongoose.Schema({
        id: String,
        refreshToken: String,
       
    },{
        timestamps: true
    }
    )
    
    const Tokens = mongoose.model('tokens', userSchema)


module.exports = Tokens

