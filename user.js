const mongoose = require('mongoose');
const bookSchema  = new mongoose.Schema({
    seat_number:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    version: { 
        type: Number, 
        default: 0 
    }
})
const book = new mongoose.model("book",bookSchema);
module.exports = book;