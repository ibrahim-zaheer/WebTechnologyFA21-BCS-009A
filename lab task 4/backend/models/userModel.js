const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phonenumbers: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    
    passwords: {
        type: String,
        required: true
    },
    isAdmin:{
    type: Boolean,
    default: false
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});


const Userinfo = mongoose.model('Userinfo', userSchema);

module.exports = Userinfo;
