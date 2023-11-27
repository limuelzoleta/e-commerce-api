// [SECTION] Dependencies & Modules
const express = require('express');
const orderController = require('../controllers/order');
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router  = express.Router();



// [SECTION] User Checkout (Non-Admin) Route (This is like Buy Now Feature)
router.post("/checkout", verify, orderController.checkOutOrder) 


// [SECTION] Retrieve Authenticated User's Orders 
router.get("/", verify, orderController.getUserOrder)


// [SECTION] Retrieve All User's Orders (Admin)
router.get("/all", verify, verifyAdmin, orderController.getAllUserOrder)



// [SECTION] Export Route System
module.exports = router;