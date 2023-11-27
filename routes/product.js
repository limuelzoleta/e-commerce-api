// [SECTION] Dependencies & Modules
const express = require('express');
const productController = require('../controllers/product');
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router  = express.Router();


// [SECTION] Creating a Product Route
router.post("/", verify, verifyAdmin, productController.addProduct);


// [SECTION] Retrieving All Active Products Route 
router.get("/",  productController.getAllActiveProducts)


// [SECTION] Retrieving All Products Route 
router.get("/all", verify, verifyAdmin, productController.getAllProducts)


// [SECTION] Retrieving A Specific Product by ID Route 
router.get("/:productId", productController.getASingleProduct)


// [SECTION] Updating a Product by ID Information Route
router.put("/:productId", verify, verifyAdmin, productController.updateProduct)


// [SECTION] Archiving a Product Information by ID Route
router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct)


// [SECTION] Activating a Product by ID Route
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct)




// [SECTION] Export Route System
module.exports = router;