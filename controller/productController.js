import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asynHandler.js";
import { client as redisClient } from "../server.js";
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const FetchProducts = asyncHandler(async (req, res) => {
	try {
		// Check the cache first
		const cachedProducts = await redisClient.get("products");
		// If not found in cache, fetch from database
		console.log("line 12", Boolean(cachedProducts));
		if (cachedProducts) {
			// If cached data is found, parse it and send as response
			res.json(JSON.parse(cachedProducts));
		} else {
			const productsFromDB = await Product.find({});
			// Cache the result in Redis for 1 hour (3600 seconds)
			await redisClient.setEx("products", 3600, JSON.stringify(productsFromDB));
			// Send the result as response
			res.json(productsFromDB);
		}
	} catch (err) {
		// Handle any errors
		res.status(500).json({ message: "Server error" });
	}
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const FetchProductById = asyncHandler(async (req, res) => {
	try {
		const productId = req.params.id;
		// Check the cache first
		const cachedProduct = await redisClient.get(`product:${productId}`);

		if (cachedProduct) {
			// If cached data is found, parse it and send as response
			res.json(JSON.parse(cachedProduct));
		} else {
			const productFromDB = await Product.findById(productId);
			if (productFromDB) {
				// Cache the result in Redis for 1 hour (3600 seconds)
				await redisClient.setEx(
					`product:${productId}`,
					3600,
					JSON.stringify(productFromDB)
				);
				// Send the result as response
				res.json(productFromDB);
			} else {
				res.status(404).json({ message: "Product not found" });
			}
		}
	} catch (err) {
		// Handle any errors
		res.status(500).json({ message: "Server error" });
	}
});
export { FetchProducts, FetchProductById };
