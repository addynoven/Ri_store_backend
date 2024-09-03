import asyncHandler from "../middleware/asynHandler.js";
import Order from "../models/orderModel.js";
import RazorPay from "../models/razorpayModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res, next) => {
    console.log(req.body, "req.body");
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAmount,
        razorpayId,
        updatedAt,
    } = req.body;
    console.log(razorpayId, "razorpayId");

    if (paidAmount < totalPrice) {
        console.log("Paid amount is less than total price");
        res.status(400);
        throw new Error("Paid amount is less than total price");
    }
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    } else {
        try {
            const order = new Order({
                orderItems: orderItems.map((item) => ({
                    ...item,
                    product: item._id,
                    _id: undefined,
                })),
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentResult: {
                    id: razorpayId,
                    update_time: updatedAt,
                },
            });

            const createdOrder = await order.save();
            console.log(createdOrder._id, "that's what we are sending see");

            // Update the RazorPay document with the created order ID
            const updatedRazorPay = await RazorPay.findByIdAndUpdate(
                razorpayId,
                { order: createdOrder._id },
                { new: true } // To return the updated document
            );

            if (!updatedRazorPay) {
                console.log(`RazorPay record not found for ID: ${razorpayId}`);
                res.status(404);
                throw new Error(
                    `RazorPay record not found for ID: ${razorpayId}`
                );
            }

            console.log(updatedRazorPay, "RazorPay updated with order ID");
            res.status(201).json({ data: createdOrder._id });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id });
    res.status(200).json(order);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/
const getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    res.status(200).json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc    Update order to delivered
// @route   put /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    res.send("update order to delivered route");
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res, next) => {
    res.send("get all orders route");
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
};
