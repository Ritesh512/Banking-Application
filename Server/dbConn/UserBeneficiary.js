const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId:String,
    detail:[
        {
            name:String,
            email:String,
            account:String
        }
    ]
});

module.exports =mongoose.model('userBeneficiary',userSchema);