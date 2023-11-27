// [SECTION] Dependencies & Modules
const Order = require("../models/Order");
const Product = require("../models/Product")
const User = require("../models/User")
const bcrypt = require('bcrypt');
const auth = require("../auth");
const { model } = require("mongoose");


// [SECTION] User Checkout (Non-Admin) Controller (This is like Buy Now Feature)
module.exports.checkOutOrder = async (req, res) => {
    try {
      const createdOrder = await this.createOrder(req.user.id, req.body.products)

      if(createdOrder.success) {
        return res.json({ success: true, message: 'Successfully created an order!', data: createdOrder.order });
      } else {
        return res.status(500).send({message: createdOrder.message})
      }

    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'An error occurred during checkout' });
    }
  };


  // [SECTION] Retrieve Authenticated User's Orders 
  module.exports.getUserOrder = async(req, res) => {
    try {
        const result = await Order.find({userId: req.user.id}).populate('products.productId');

        if (!result) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send(result)
        }

    } catch (error) {
        console.error(error);
        res.send(error)
    }
  }


  // [SECTION] Retrieve All User's Orders (Admin)
  module.exports.getAllUserOrder = async(req, res) => {
    try {
        const result = await Order.find({}).populate('products.productId');

        if (!result) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send(result)
        }

    } catch (error) {
        console.error(error);
        res.send(error);
    }
  }

// function to generate and save orders to the databse
module.exports.createOrder = async(userId, products) => {
    try {
      const productItems = [];

      for (let i = 0; i < products.length; i++) {
        //Product Validation
        const product = await Product.findById(products[i].productId);

        if (!product) {
          return { success:false, message: 'Product not found' };
        }

        // Validation if there is enough stock for the order
        if (product.stockQuantity < products[i].quantity) {
          return { success: false, message: 'Not enough stock for the order' };
        }

        // Gets the updated product price upon checkout
        const productItem = {
          productId: products[i].productId,
          quantity: products[i].quantity || 1,
          price: product.price
        }

        productItems.push(productItem)
      }


      const newCheckOut = {
        userId: userId,
        products: productItems
      };
      
      // Calculate subTotal and totalPrice for each product in the order
      newCheckOut.products.forEach(product => {
        product.subTotal = product.price * product.quantity;
      });

      newCheckOut.totalPrice = this.calculateProductsTotal(newCheckOut.products, true);

      const order = new Order(newCheckOut)
      await order.save();
  
      for(let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].productId);
        // Update the stock quantity in the database
        product.stockQuantity -= products[i].quantity || 1 ;
        await product.save();
      }

      return {success: true, order: order};
    } catch(error) {
      return { success: false, message: 'Error encountered while creating the order' }
    }
      
}


module.exports.calculateProductsTotal = (products, ignoreSelected=false) => {
  let totalPrice = 0;
  
  products.forEach(product => {
    if(ignoreSelected) {
      totalPrice += product.subTotal;
    } else if(product.isSelected) {
      totalPrice += product.subTotal;
    }
  });
  return totalPrice;
}

