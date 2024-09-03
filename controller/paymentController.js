import asyncHandler from "../middleware/asynHandler.js";
import { instance } from "../server.js";
import RazorPay from "../models/razorpayModel.js";
import crypto from "crypto";
import TempPayment from "../models/TempPayment.js";

export const checkout = asyncHandler(async (req, res, next) => {
    console.log(req.body);

    let { amount } = req.body;
    const userId = req.user._id;

    // Get the latest entry to determine the last receipt number
    const latestEntry = await RazorPay.findOne().sort({ createdAt: -1 });
    let count = 0;

    if (latestEntry && latestEntry.receiptNo) {
        const parts = latestEntry.receiptNo.split("_");
        count = parseInt(parts[parts.length - 1], 10);
    }

    // Define options for RazorPay order
    var options = {
        amount: Number(amount) * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: `order_rcptid_${count + 1}`,
    };

    try {
        // Create RazorPay order
        const order = await instance.orders.create(options);
        console.log(order);
        console.log(order.id, order.receipt);

        // Create a new payment record in temporary storage
        const Payment = new TempPayment({
            razorpay_order_id: order.id,
            user: userId,
            amount: Number(amount),
            receiptNo: order.receipt,
        });

        // Save the payment record to the database
        await Payment.save();

        // Send the response back to the client
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        // Handle any errors that occurred during order creation or payment saving
        console.error(
            "Error creating RazorPay order or saving payment:",
            error
        );
        res.status(500).json({
            success: false,
            message: "Failed to create order or save payment.",
        });
    }
});

export const paymentVerification = asyncHandler(async (req, res, next) => {
    console.log(req.body, "line 21");
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    console.log("sig received->", expectedSignature);
    console.log("sig generated->", razorpay_signature);
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log("isAuthentic? -> ", isAuthentic);
    if (isAuthentic) {
        const tempPayment = await TempPayment.findOne({ razorpay_order_id });
        if (!tempPayment) {
            return res
                .status(404)
                .json({ success: false, message: "Payment record not found." });
        }
        console.log("Payment verified successfully");
        // Create the permanent payment record
        const Payment = new RazorPay({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user: tempPayment.user,
            receiptNo: tempPayment.receiptNo,
            amount: tempPayment.amount,
        });

        // Save the permanent payment record
        await Payment.save();

        // Delete the temporary payment record
        await TempPayment.deleteOne({ razorpay_order_id });

        console.log("Payment verified and recorded successfully");

        res.redirect(
            `http://localhost:3000/paymentsuccess?reference=${razorpay_order_id}`
        );
    } else {
        res.status(400).json({ success: false });
    }
});

export const verifyPayment = asyncHandler(async (req, res, next) => {
    const { reference: orderId } = req.body.orderId;
    console.log(orderId, "line 55");
    try {
        const paymentDoc = await RazorPay.findOne({
            razorpay_order_id: orderId,
        }).exec();
        console.log(paymentDoc, "line 58");
        if (!paymentDoc) {
            throw new Error("Payment not found");
        }
        const Payment = paymentDoc
            ? {
                  Id: paymentDoc._id,
                  order: paymentDoc.order,
                  amount: paymentDoc.amount,
                  receiptNo: paymentDoc.receiptNo,
                  updatedAt: paymentDoc.updatedAt,
              }
            : null;
        res.status(200).json({ data: Payment, success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            error: error,
            message: "Payment not verified",
        });
    }
});
