// [SECTION] Modules and Dependencies
const mongoose = require('mongoose');

// [SECTION] Schema 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is Required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true // to ensure email uniqueness
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is Required']
    }, 
    shippingAddress: {
        type: String, 
        required: [true, 'Shipping Address is Required']
    },
	createdOn: {
		type: Date,
	    default: new Date()
	}
 });

// [SECTION] Exporting Model
module.exports = mongoose.model('User', userSchema); 