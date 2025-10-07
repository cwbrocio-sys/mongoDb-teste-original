import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import mercadopagoRouter from "./routes/mercadopagoRoute.js";
import deliveryRouter from "./routes/deliveryRoute.js";
import freightRouter from "./routes/freightRoute.js";
import couponRouter from "./routes/couponRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import trackingRouter from "./routes/trackingRoute.js";
import { setupTrackingCron } from "./jobs/trackingCron.js";

// App Config
const app = express();
const port = process.env.PORT || 3000;

// Connect DB
connectDB();

// Connect Cloudinary
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Api Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/mercadopago", mercadopagoRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/review", reviewRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/freight", freightRouter);
app.use("/api/tracking", trackingRouter);

app.get("/", (req, res) => {
  res.send("API está funcionando");
});

// Inicializar jobs cron
setupTrackingCron();

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
