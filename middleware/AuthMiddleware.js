import jwt from "jsonwebtoken";
import asyncHandler from "./asynHandler.js";
import users from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await users.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			console.log(error);
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	} else {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

const Admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized as an admin");
	}
};

export { protect, Admin };
