// [SECTION] Modules and Dependencies
const mongoose = require('mongoose');

// [SECTION] Schema/Blueprint 
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Name is Required']
    },
    description: {
        type: String,
        required: [true, 'Product Description is Required']
    }, 
    price: {
        type: Number,
        required: [true, 'Price is Required']
    }, 
    discount: {
        type: Number,
        required: [false, 'Discount is Not Required']
    },
    isActive: {
		type: Boolean, 
		default: true
	},
    createdOn: {
		type: Date,
	    default: new Date()
	},
    images: [{
        type: String,
        description: 'Store product image URLs'
    }],
    category: {
        type: String,
        description: 'Category for product'
    },
    tags: {
        type: String,
        description: 'Tags for product'
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Stock quantity is required']
    },
    ratings: [{
        type: Number,
        description: 'Array of product ratings'
    }]
});

// [SECTION] Exporting Model
module.exports = mongoose.model('Product', productSchema); 