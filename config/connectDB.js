const mongoose = require('mongoose');

const MongoDB = async () => {
    try{
      const res =  mongoose.connect(process.env.MONGOOSE_URI , { useNewUrlParser: true }).then(()=>{
            console.log('Connected to MongoDB');
})
    }catch(err){
        console.log('Error connecting to MongoDB', err)
    }
}

module.exports = MongoDB;

