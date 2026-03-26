const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    farmerId: {
        type: String,
        required: true
    },
    cropType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    harvestDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Product', productSchema);