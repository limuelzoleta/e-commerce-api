// [SECTION] Dependencies & Modules
const express = require('express');
const cartController = require('../controllers/cart');
const Order = require("../models/Order");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router  = express.Router();


//[SECTION] Add a Product to Cart Route
router.post("/add-product", verify, cartController.addProductToCart);


//[SECTION] Remove a Product to Cart Route
router.delete("/remove-product", verify, cartController.removeProductToCart);


//[ADDITIONAL FEATURE] View User's Cart Route
router.get("/", verify, cartController.viewCart)


//[ADDITIONAL FEATURE] Unselect Product by ID in Cart Route
router.patch("/:productId/unselect", verify, cartController.unselectItem)

//[ADDITIONAL FEATURE] Select Product by ID in Cart Route
router.patch("/:productId/select", verify, cartController.selectItem)


//[ADDITIONAL FEATURE] Checkout all selected items in cart Route
router.post("/checkout", verify, cartController.checkOutSelectedItems)



// [SECTION] Export Route System
module.exports = router;