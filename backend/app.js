import express from "express";
import cookieParser from "cookie-parser";
import notFoundHandler from "./middleware/notFoundMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";
import logger from "./middleware/logger.js";
import path from "path";

// router imports
import userRouter from "./routes/user.router.js";
import productRouter from "./routes/product.router.js";
import orderRouter from "./routes/order.router.js";
import uploadRouter from "./routes/upload.router.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving - Add these lines
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(logger);

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/image", uploadRouter);

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is running");
  });
}

// error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
