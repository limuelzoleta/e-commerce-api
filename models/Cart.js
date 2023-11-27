const mongoose = require('mongoose');

// [SECTION] Schema/Blueprint

const cartSchema = new mongoose.Schema({
	products: [
        {
            productId: {
                type:  mongoose.Schema.Types.ObjectId,
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
                default: 1
            }, 
            isSelected: {
                type: Boolean, 
                default: true
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
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
	createdOn: {
		type: Date,
	    default: new Date()
	}
});

module.exports = mongoose.model('Cart', cartSchema);