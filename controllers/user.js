// [SECTION] Dependencies & Modules
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product")
const bcrypt = require('bcrypt');
const auth = require("../auth");


// [SECTION] Registration Controller
module.exports.registerUser = async (req, res) => {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            mobileNo: req.body.mobileNo, 
            shippingAddress: req.body.shippingAddress
        });

        const user = await newUser.save();

        if (user) {
            console.log(user._id)

            const newCart = new Cart({
                userId: user._id,
                totalPrice: 0
            })
    
            const cart = await newCart.save()
            if(cart) {
                //cart is also created if registration is successful
                return res.send({ message: 'Registration successful.'});
            } else {
                return res.send({ message: 'Failed to create cart.'})
            }
        } else {
            return res.send({ message: 'Failed to create user.'});
        }
    } catch (error) {
        console.error(error);
    
        // Check if the error is due to a duplicate key violation (unique constraint)
        if (error.code === 11000) {
          return res.status(400).send({ message: 'Email is already in use.' });
        }
    
        return res.status(500).send({ message: 'Internal Server Error' });
      }
    };



// [SECTION] User Authentication
 module.exports.loginUser = async (req, res) => {
    try {
        const result = await User.findOne({ email: req.body.email });

        if(result == null){
            return false
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

            if(isPasswordCorrect){
                return res.send({ access: auth.createAccessToken(result)})
            } else {
                return res.send(false);
            }
        }
    } catch (error) {
        res.send(error);
    }
 }



//[SECTION] Retrieve User Details 
module.exports.getUserDetails = async (req, res) => {
    try {
        const result = await User.findById(req.user.id);
        
        if (!result) {
            return res.send(false);
        } else {
            return res.send(result)
        }
    } catch (error) {
        console.error(error);
        res.send(error)
    }
}



//[SECTION] Set User as Admin Controller
module.exports.updateUserAsAdmin = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Update the user's isAdmin's field to true
        user.isAdmin = true;
        await user.save()

        res.status(200).json({ message: 'User updated to admin successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


