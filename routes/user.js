// [SECTION] Dependencies & Modules
const express = require('express');
const userController = require('../controllers/user');
const Order = require("../models/Order");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router  = express.Router();


// [SECTION] Registration Route
router.post('/register', userController.registerUser);


// [SECTION] User Authentication Route
router.post("/login", userController.loginUser);


//[SECTION] Retrieve User Details 
router.get("/userDetails", verify, userController.getUserDetails)


//[SECTION] Set User as Admin Route
router.put('/update-admin', verify, verifyAdmin, userController.updateUserAsAdmin);








// [SECTION] Export Route System
module.exports = router;