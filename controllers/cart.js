// [SECTION] Dependencies & Modules
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require('bcrypt');
const auth = require("../auth");
const { updateProduct } = require("./product");
const { createOrder, calculateProductsTotal } = require("./order")
const { ObjectId } = require('mongoose')


// [SECTION] Add a Product to Cart Controller
module.exports.addProductToCart = async (req, res) => {
    try { 
        const userId = req.user.id;

        const cart = await Cart.findOne({
            userId: userId
        });

        //Product Validation
        const isValidProduct = await Product.findById(req.body.productId);

        if (!isValidProduct) {
            return res.status(404).send('Product not found');
          }
        
          // Validation if there is enough stock to add to cart
          if (isValidProduct.stockQuantity < req.body.quantity) {
            return res.send({ message: 'Not enough stock for the order' });
        }
        
        console.log(cart);
        if (cart) {
            const existingProducts = cart.products.find(product => product.productId == req.body.productId)
            console.log('Existing products in cart: ', existingProducts)

            let updatedProducts = cart.products;
            if (existingProducts) {
                //if the product already exists, quantity is added (indicated quantity or if no quantity is indicated plus one)
                updatedProducts = cart.products.map(product => {
                    if (product.productId == req.body.productId) {
                        product.quantity += req.body.quantity || 1
                    }
                    return product;
                })
            } else {

                //if product does not exist yet, append the new product at the beginning of the array
                const newProduct = {
                    productId: req.body.productId,
                    quantity: req.body.quantity || 1,
                    price: isValidProduct.price
                }
                updatedProducts.unshift(newProduct);
            }

                // Calculate subTotal and totalPrice for each product in the cart
            updatedProducts.forEach(product => {
                product.subTotal = product.price * product.quantity;
            });

            cart.products = updatedProducts;
            cart.totalPrice = calculateProductsTotal(updatedProducts);

            const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart);
            console.log(updatedCart)
            return res.send({success:true, message:'Product has been successfully added!'})

        } else {
            return res.send({ message: 'Cannot find cart for this user'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while validating the product' })
    }
}



//[SECTION] Remove a Product to Cart Controller
module.exports.removeProductToCart = async(req, res) => {
    try { 
        const userId = req.user.id;

        const cart = await Cart.findOne({
            userId: userId
        });

        if (cart) {
            // this is the array opf products in the cart
            const existingProducts = cart.products.find(product => product.productId == req.body.productId)
            console.log('Existing products in cart: ', existingProducts)

            let updatedProducts = cart.products;
            if (existingProducts) {
                //if the product already exists, quantity is subtracted (indicated quantity or if no quantity is indicated, minus one)
                updatedProducts = cart.products.map(product => {
                    if (product.productId == req.body.productId) {
                        product.quantity -= req.body.quantity || 1;
                    }
                    return product
                }).filter(product => product.quantity > 0)

    
            } else {
                //if product does not exist, return a message product is not in cart
                return res.send({ message: 'Product is not in cart'})
            }
            updatedProducts.forEach(product => {
                product.subTotal = product.price * product.quantity;
            });

            cart.products = updatedProducts;
            cart.totalPrice = calculateProductsTotal(updatedProducts)

            const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart);
            console.log(updatedCart)
            res.send({success:true, message:'Product has been successfully removed/decremented!'})

        } else {
            res.send({ message: 'Cannot find cart for this user'})
        }
    } catch (error) {
        console.error(error);
        return res.send(error)
    }
}
    



//[ADDITIONAL FEATURE] View User's Cart Controller
module.exports.viewCart = async(req, res) => {
    try {

        const result = await Cart.find({userId: req.user.id}).populate('products.productId');
        console.log(result)

        if(!result) {
            return res.status(404).send('Cart not found');
        } else {
            return res.status(200).send(result);
        }

    } catch (error) {
        console.error(error);
        return res.send(error)
    }
}



//[ADDITIONAL FEATURE] Unselect Product by ID in Cart Route
module.exports.unselectItem = async(req, res) => {
    try {

        const resultUserCart = await Cart.findOne({userId: req.user.id});

        if (!resultUserCart) {
            return res.status(404).send('Cart not found');
        } else {

            const updatedProducts = resultUserCart.products.map(product => {
                console.log(product, '<- product')
                if (product.productId == req.params.productId) {
                    product.isSelected = false;
                } 
                return product;
            })
            resultUserCart.products = updatedProducts;
            resultUserCart.totalPrice = calculateProductsTotal(updatedProducts)
            const updatedCart = await Cart.findByIdAndUpdate(resultUserCart._id, resultUserCart);

            if (!updatedCart) {
                return res.send('Error while updating cart');
            } else {
                return res.json({ success: true, message: 'Item successfully unselected'});
            }
        }

    } catch (error) {
        console.error(error);
        return res.send(error);
    }
}

//[ADDITIONAL FEATURE] Select Product by ID in Cart Route
module.exports.selectItem = async(req, res) => {
    try {

        const resultUserCart = await Cart.findOne({userId: req.user.id});

        if (!resultUserCart) {
            return res.status(404).send('Cart not found');
        } else {

            const updatedProducts = resultUserCart.products.map(product => {
                console.log(product, '<- product')
                if (product.productId == req.params.productId) {
                    product.isSelected = true;
                } 
                return product;
            })
            resultUserCart.products = updatedProducts;
            resultUserCart.totalPrice = calculateProductsTotal(updatedProducts)
            const updatedCart = await Cart.findByIdAndUpdate(resultUserCart._id, resultUserCart);

            if (!updatedCart) {
                return res.send('Error while updating cart');
            } else {
                return res.json({ success: true, message: 'Item successfully selected'});
            }
        }

    } catch (error) {
        console.error(error);
        return res.send(error);
    }
}


//[ADDITIONAL FEATURE] Checkout all selected items in cart
module.exports.checkOutSelectedItems = async (req, res) => {
    try {
        
        const result = await Cart.findOne({ userId: req.user.id });
        console.log(result);
        if(!result) {
            return res.send('Error encountered while retrieving your cart')
        } else {
            const cartProducts = [];

            const unselectedProducts = []

            for(let i = 0; i < result.products.length; i++) {
                if (result.products[i].isSelected) {
                    const item = {
                        productId: result.products[i].productId,
                        quantity: result.products[i].quantity
                    }
                    cartProducts.push(item);
                } else {
                    unselectedProducts.push(result.products[i])
                }
            }

            if (cartProducts.length <= 0) {
                return res.json({success: false, message: 'Checkout failed, no selected items'})
            }

            const createdOrder = await createOrder(req.user.id, cartProducts);
            if(createdOrder.success) {
                result.products = unselectedProducts 
                result.totalPrice = 0;
                result.save()
                res.json({success: true, data: createdOrder.order})
            } else {
                res.status(500).send({message: createdOrder.message})
            }
        }

    } catch (error) {
        console.error(error);
        res.send(error);
    }
}
