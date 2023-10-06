const mongoose = require('mongoose');

const MongoDB = async () => {
    try{
      const res =  mongoose.connect('mongodb+srv://admin101:admin101@cluster0.wc4q6ea.mongodb.net/test', { useNewUrlParser: true }).then(()=>{
            console.log('Connected to MongoDB');
})
    }catch(err){
        console.log('Error connecting to MongoDB', err)
    }
}

module.exports = MongoDB;

