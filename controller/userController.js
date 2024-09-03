import asyncHandler from "../middleware/asynHandler.js";
import users from "../models/userModel.js";
import generateToken from "../utils/GenerateToken.js";

// @desc	Auth user & get token
// @route	POST /api/users/login
// @access	Public
const authUser = asyncHandler(async (req, res, next) => {
	console.log(req.body, "line 10s");
	const { email, password } = req.body;
	if (!Boolean(email)) {
		throw new Error("Please enter email");
	}
	const user = await users.findOne({ email });
	if (user && (await user.matchPassword(password))) {
		generateToken(res, user._id);
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

// @desc	Register a new user
// @route	POST /api/users
// @access	Public
const registerUser = asyncHandler(async (req, res, next) => {
	const { name, email, password } = req.body;
	console.log(req.body, "line 34s");
	const userExists = await users.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}
	const user = await users.create({
		name,
		email,
		password,
	});
	if (user) {
		generateToken(res, user._id);
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc	Logout user / clear cookie
// @route	POST /api/users/logout
// @access	Private
const logoutUser = asyncHandler(async (req, res, next) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	res.status(200);
	res.json({ message: "Logged out successfully" });
});

// @desc	Get user profile
// @route	GET /api/users/profile
// @access	Private
const getUserProfile = asyncHandler(async (req, res, next) => {
	const user = await users.findById(req.user._id);
	if (user) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc Update user profile
// @route	PUT /api/users/profile
// @access	Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
	const user = await users.findById(req.user._id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}
		const updatedUser = await user.save();
		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc	Get all users
// @route	GET /api/users
// @access	Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
	res.send("Get all users");
});

// @desc	Get user by ID
// @route	GET /api/users/:id
// @access	Private/Admin
const getUserById = asyncHandler(async (req, res, next) => {
	res.send("user by id route");
});

// @desc	Delete user
// @route	DELETE /api/users/:id
// @access	Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
	res.send("delete user route");
});

// @desc	Update user
// @route	PUT /api/users/:id
// @access	Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
	res.send("update user route");
});

export {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	getUserById,
	deleteUser,
	updateUser,
};
