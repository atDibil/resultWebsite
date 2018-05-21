const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }

});

let userModel = module.exports = mongoose.model('user', userSchema, 'user');