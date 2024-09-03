import express from "express";

import {
    checkout,
    paymentVerification,
    verifyPayment,
} from "../controller/paymentController.js";
import { protect } from "../middleware/AuthMiddleware.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Payment Route hello there");
});

router.post("/checkout", protect, checkout);

router.post("/paymentverification", protect, paymentVerification);

router.post("/verify", protect, verifyPayment);

export default router;
