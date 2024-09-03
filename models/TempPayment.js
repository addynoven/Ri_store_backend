import mongoose from "mongoose";

const tempPaymentSchema = new mongoose.Schema(
    {
        razorpay_order_id: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        amount: {
            type: Number,
            required: true,
        },
        receiptNo: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            expires: "5m",
            default: Date.now,
        }, // Automatically removes entries after 5 minutes
    },
    {
        timestamps: true,
    }
);

const TempPayment = mongoose.model("TempPayment", tempPaymentSchema);
export default TempPayment;
