// [SECTION] Modules and Dependencies
const mongoose = require('mongoose');

// [SECTION] Schema/Blueprint 
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',                                 //Reference to the User model
        required: [true, 'User ID is required']
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product ID is required']
            }, 
            price: {
                type: Number,
                ref: 'Product',
                required: [true, 'Product ID is required']
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is Required']
            },
            subTotal: {
                type: Number,
                required: true
              }
        }
    ], 
    totalPrice: {
        type: Number,
        required: true
    },
    purchasedOn: {
        type: Date,
        default: new Date()
    },
    paymentMethods: {
        type: String, 
        default: 'cash'
    }
});

// [SECTION] Exporting Model
module.exports = mongoose.model('Order', orderSchema); 