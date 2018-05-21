const mongoose = require('mongoose');

let resultSchema = mongoose.Schema({

    symbolno:{
        type: Number,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    faculty:{
        type: String,
        required: true
    },
    cgpa:{
        type: Number,
        required: true
    }

});

let resultModel = module.exports = mongoose.model('result', resultSchema, 'result');