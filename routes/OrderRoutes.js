import express from "express";

const router = express.Router();

import {
	addOrderItems,
	getMyOrders,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getOrders,
} from "../controller/orderController.js";
import { protect, Admin } from "../middleware/AuthMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, Admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, Admin, updateOrderToDelivered);

export default router;
