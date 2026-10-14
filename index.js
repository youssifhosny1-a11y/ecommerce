import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { cartRouter } from "./routes/cart.route.js";
import { ordersRouter } from "./routes/order.route.js";
import { pagesRouter } from "./routes/pages.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { checkAuth } from "./middleware/checkauth.js";
import { checkRole } from "./middleware/checkrole.js";

process.loadEnvFile();

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

// TODO: mount your API routers here
app.use("/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", checkAuth, checkRole("customer"), cartRouter);
app.use("/api/orders", checkAuth, checkRole("customer"), ordersRouter);
// app.use("/api/debug", debugRouter);

app.use(pagesRouter);

app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({ error: "something went wrong" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
