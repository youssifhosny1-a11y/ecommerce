import express from "express";
import { createDB } from "../db.js";


export const ordersRouter = express.Router();
const db = createDB();


ordersRouter.get("/",  async (req, res, next) => {
    try {
      const userId = req.user.id;

      const orders = await db.getAll("orders");

      const userOrders = orders.filter(
        (order) => order.userId === userId
      );

      return res.status(200).json({
        data: userOrders,
      });
    } catch (err) {
      next(err);
    }
  }
);


//

ordersRouter.post("/checkout", async (req, res, next) => {
    try {
      const userId = req.user.id;

      const carts = await db.getAll("carts");

      const cart = carts.find(
        (cart) => cart.userId === userId
      );

      if (!cart || cart.products.length === 0) {
        return res.status(422).json({
            error: "cart is empty",
        });
      }

      const total = cart.products.reduce(
        (sum, product) => {
            return sum + product.price * product.quantity;
        },0
     );

      const newOrder = await db.create("orders", {
        userId,
        products: cart.products,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      await db.update("carts", cart.id, {
        products: [],
      });

      return res.status(201).json({
        message: "order placed successfully",
        data: newOrder,
      });


    } catch (err) {
      next(err);
    }
  }
);