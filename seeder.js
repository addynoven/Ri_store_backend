import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import Product from "./models/productModel.js";
import User from "./models/userModel.js";
import user_data from "./data/users.js";
import product_data from "./data/data.js";

dotenv.config();

connectDB();

const importData = async () => {
	try {
		await Product.deleteMany();
		await User.deleteMany();
		const createdUsers = await User.insertMany(user_data);
		const adminUser = createdUsers[0]._id;
		const sampleProducts = product_data.map((product) => {
			return { ...product, user: adminUser };
		});
		await Product.insertMany(sampleProducts);
		console.log("Data Imported!".green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

importData();
