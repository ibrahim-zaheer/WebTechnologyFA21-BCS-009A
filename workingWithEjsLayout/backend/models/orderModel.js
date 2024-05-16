const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    outlet: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    animal: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    deliveryDay: {
        type: Date,
        required: true
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
