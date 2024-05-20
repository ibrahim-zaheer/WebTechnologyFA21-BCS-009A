// orderModel.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        total: Number
    }],
    subtotal: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
