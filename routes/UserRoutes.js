import express from "express";
import {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	getUserById,
	deleteUser,
	updateUser,
} from "../controller/userController.js";

import { protect, Admin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.route("/").get(protect, Admin, getUsers).post(registerUser);
router.post("/logout", logoutUser);
router.post("/auth", authUser);
router
	.route("/profile")
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);
router
	.route("/:id")
	.get(protect, Admin, getUserById)
	.delete(protect, Admin, deleteUser)
	.put(protect, Admin, updateUser);

export default router;
