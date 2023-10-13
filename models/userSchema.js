const mongoose = require('mongoose')

    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "Please enter your name"],
            min: [6, "Name must be at least 6 characters long"],
            max: [255, "Name must be less than 255 characters long"],
            lowercase: [true, "Name must be lowercase"],
        },
        email: {
            type: String,
            required: [true, "Please enter your Mail"],
        },
        hashpassword: {
            type: String,
            required: [true, "Please enter your Password"],
           
        },
    },{
        timestamps: true
    }
    )
    userSchema.statics.usenameTaken = async function(name){
        const user = await this.findOne({name})
        if(user) return true

        return false
    }
    userSchema.statics.emailTaken = async function(email){
        const user = await this.findOne({email})
        if(user) return true

        return false
    }
    
    
    const User = mongoose.model('users', userSchema)


module.exports = User

