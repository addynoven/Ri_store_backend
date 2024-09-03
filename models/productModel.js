import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
});

const productSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		name: { type: String, required: true },
		image: { type: String, required: true },
		description: { type: String, required: true },
		brand: { type: String, required: true, default: "Ri Store" },
		category: { type: String, required: true },
		price: { type: Number, required: true },
		countInStock: { type: Number, required: true },
		rating: { type: Number, required: true, defaultValue: 0 },
		isBestSeller: { type: Boolean, required: true, default: false },
		numReviews: { type: Number, required: true, defaultValue: 0 },
		reviews: [{ reviewSchema }],
		manufacturerInformation: { type: String, required: true, default: "China" },
		packerInformation: {
			type: String,
			required: true,
			default: "B58A near Amrita apartment Vijay Nagar lalghati Bhopal",
		},
		netWeight: { type: String, required: true, default: "12g" },
		supplierInformation: { type: String, required: true, default: "Ri Store" },
		baseMetal: { type: String, required: true, default: "Stainless Steel" },
		Plating: { type: String, required: true, default: "Gold Plated" },
		sizing: { type: String, required: true, default: "Adjustable" },
		stoneType: { type: String, required: true, default: "No Stone" },
		Type: { type: String, required: true, default: "Studs" },
		netQuantity: { type: Number, required: true, default: 5 },
		antiTarnish: { type: Boolean, required: true, default: true },
		waterproof: { type: Boolean, required: true, default: true },
		material: { type: String, required: true, default: "Stainless" },
		countryOfOrigin: { type: String, required: true, default: "china" },
	},
	{ timestamps: true }
);

const Product = mongoose.model("product", productSchema);

export default Product;
