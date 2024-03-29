const mongoose = require('mongoose');

const meatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image:{
        type:String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Meat = mongoose.model('Meater', meatSchema);

module.exports = Meat;
