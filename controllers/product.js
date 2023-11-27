// [SECTION] Dependencies & Modules
const Product = require("../models/Product");
const bcrypt = require('bcrypt');
const auth = require("../auth");



// [SECTION] Creating a Product Controller
module.exports.addProduct = async (req, res) => {

    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stockQuantity: req.body.stockQuantity,
            images: [req.body.imageUrl]
        })

        const result = await newProduct.save();

        if (!result) {
            return res.send({ success:false, message: 'failed to create product' });
        } else {
            return res.send({success: true, data: result})
        }

    } catch (error) {
        console.error(error)
    }
}


// [SECTION] Retrieving All Active Products Controller
module.exports.getAllActiveProducts = async (req, res) => {
    try {
        const result = await Product.find({ isActive: true })

        if(!result) {
            res.send(false);
        } else {
            res.send(result);
        }

    } catch (error) {
        console.error(error)
        res.send(error);
    }
}



// [SECTION] Retrieving All Products Controller
module.exports.getAllProducts = async (req, res) => {
    try {
        const result = await Product.find({})

        if(!result) {
            res.send(false);
        } else {
            res.send(result);
        }

    } catch (error) {
        console.error(error)
        res.send(error);
    }
}



// [SECTION] Retrieving A Specific Product by ID Controller
module.exports.getASingleProduct = async (req, res) => {
    try {
        const result  = await Product.findById(req.params.productId);

        if(!result) {
            res.send(false);
        } else {
            res.send(result);
        }

    } catch (error) {
        console.error(error)
        res.send(error);
    }
}


// [SECTION] Updating a Product Information by ID Controller
module.exports.updateProduct = async (req, res) => {
    const updatedProduct = {}

    const { name, description, price, stockQuantity, imageUrl } = req.body;

    if (name) { updatedProduct.name = name }
    if (description) { updatedProduct.description = description }
    if (price) { updatedProduct.price = price }
    if (stockQuantity) { updatedProduct.stockQuantity = stockQuantity }
    if (imageUrl) { updatedProduct.images = [imageUrl] }

    console.log(updatedProduct);

    try {
        const result = await Product.findByIdAndUpdate(req.params.productId, updatedProduct);

        if(!result) {
            res.send(false);
        } else {
            res.send(true);
        }
    } catch (error) {
        console.error(error)
        res.send(error);
    }
}



// [SECTION] Archiving a Product Information by ID Controller
module.exports.archiveProduct = async (req, res) => {
    const updatedProduct = { isActive: false }

    try {
        const result = await Product.findByIdAndUpdate(req.params.productId, updatedProduct);

        if (!result) {
            return res.send(false)
        } else {
            return res.send(true)
        }
    } catch (error) {
        console.error(error)
        res.send(error);
    }
}


// [SECTION] Activating a Product by ID Controller
module.exports.activateProduct = async (req, res) => {
    const activatedProduct = { isActive: true }

    try{
        const result = await Product.findByIdAndUpdate(req.params.productId, activatedProduct);

        if (!result) {
            return res.send(false);
        } else {
            return res.send(true)
        }
    } catch (error) {
        console.error(error);
        res.send(error)
    }
}

