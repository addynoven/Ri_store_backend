import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import ProductRoute from "./routes/ProductRoutes.js";
import UserRoute from "./routes/UserRoutes.js";
import OrderRoute from "./routes/OrderRoutes.js";
import paymentRoute from "./routes/paymentRoute.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import { notfound, errorHandler } from "./middleware/ErrorHander.js";
import Razorpay from "razorpay";
import cors from "cors";
dotenv.config();
connectDB();

const app = express();

app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                "https://ri-store-frontend.vercel.app",
                "http://localhost:3000",
            ];
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(morgan("dev"));

// cookie parser
app.use(cookieParser());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

client.on("error", (err) => {
    console.error("Redis client error:", err);
});

client.on("connect", () => {
    console.log("Connected to Redis");
});

const initializeRedis = async () => {
    try {
        await client.connect();
        console.log("Redis connection established");

        await client.set("test-key", "apple");
        console.log("Set test-key");

        const value = await client.get("test-key");
        console.log("Value of test-key:", value);
    } catch (err) {
        console.error("Error with Redis operations:", err);
    }
};

initializeRedis();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
    const host = req.get("host"); // Get the hostname
    const protocol = req.protocol; // Get the protocol (http or https)
    const fullUrl = `${protocol}://${host}`; // Combine protocol and host
    console.log(`Backend is live at: ${fullUrl}`);
    res.send(`Hello world from backend and it is running on port ${fullUrl}`);
});

app.use("/api/products", ProductRoute);
app.use("/api/users", UserRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/payments", paymentRoute);

app.use(notfound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend is running on ${PORT}.`);
});

export { client };
