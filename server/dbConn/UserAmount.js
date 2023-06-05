const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId:String,
    balance:Number,
    date:Array,
    received:Array,
    send:Array
});

module.exports =mongoose.model('userAmount',userSchema);