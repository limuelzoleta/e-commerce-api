// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

// Environment Setup
const port = 4003;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


// [SECTION] Database Connection
	mongoose.connect("mongodb+srv://admin:admin@zuitt-bootcamp.siwmure.mongodb.net/capstone2?retryWrites=true&w=majority", {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));


// [SECTION] Backend Routes
	app.use("/b3/users", userRoutes);
	app.use("/b3/products", productRoutes);
	app.use("/b3/cart", cartRoutes);
	app.use("/b3/orders", orderRoutes)


if(require.main === module){
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port}`)
	})
}

module.exports = {app, mongoose};