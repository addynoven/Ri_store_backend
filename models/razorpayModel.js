import mongoose from "mongoose";

const razorpaySchema = new mongoose.Schema(
    {
        razorpay_order_id: {
            type: String,
            required: true,
            unique: true,
        },
        razorpay_payment_id: {
            type: String,
            require: true,
            unique: true,
        },
        razorpay_signature: {
            type: String,
            require: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },
        amount: {
            type: Number,
            required: true,
        },
        receiptNo: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const RazorPay = mongoose.model("Razorpay", razorpaySchema);
export default RazorPay;
