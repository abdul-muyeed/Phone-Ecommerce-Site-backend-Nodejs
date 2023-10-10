const mongoose = require('mongoose')

    const userSchema = new mongoose.Schema({
        name: String,
        price: Number,
        image: Array,
        description: String,
        category: String,
        brand: String,
        rating: Number,
        numReviews: Number,
        colorObj: Object,
        ram: Array,
        rom: Array,
        tag: Array
       
    })
    
    const products = mongoose.model('products', userSchema)


module.exports = products