import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/vallidatebody.js";
import { addToCartSchema } from "../schema/cart.schema.js";
import { updateCartSchema } from "../schema/cart.schema.js";


export const cartRouter = express.Router();

const db = createDB();




//GET Cart
cartRouter.get("/" , async(req , res , next)=>{
     try {
        const userId = req.user.id;

        const carts = await db.getAll("carts");

        const cart = carts.find(
            (cart) => cart.userId === userId
        );

        if (!cart) {
            return res.status(200).json({
            data: {
                id: null,
                userId,
                products: [],
            },
            });
        }

        return res.status(200).json({
            data: cart,
        });

    } catch (err) {
      next(err);
    }
  
})


// Create Cart

cartRouter.post("/" , validateBody(addToCartSchema) , async(req , res , next)=>{
     try {
        const userId = req.user.id;

        const product = req.body;

        const carts = await db.getAll("carts");

        const cart = carts.find(
            (cart) => cart.userId === userId
        );
        if (!cart) {
            const newCart = await db.create("carts" , {
                userId,
                products: [product]
            });
            return res.status(201).json({
                message: "product added to cart",
                data: newCart,
            })

        }

        const existingProduct = cart.products.find(
            (item) => item.id === product.id
        );
        if (existingProduct) {
             existingProduct.quantity += product.quantity;
        }
        else {
           cart.products.push(product);
        }

        await db.update("carts", cart.id, {
            products: cart.products,
        });

        return res.status(201).json({
            message: "product added to cart",
            data: cart,
        });


    } catch (err) {
      next(err);
    }
  
})



// Update quantity of a product in cart

cartRouter.patch("/:productId", validateBody(updateCartSchema), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        //  check if in database
        const carts = await db.getAll("carts");

        const cart = carts.find(
            (cart) => cart.userId === userId
        );
        // if not cart
        if (!cart) {
            return res.status(404).json({
                error: "cart not found",
            });
        }


        const product = cart.products.find(
            (item) => item.id === productId
        );
         // if not product
        if(!product) {
            return res.status(404).json({
                Error: "product not found in cart"
            })
        }
        // Change the quantity
        product.quantity = quantity;

        // update in Data base
        await db.update("carts", cart.id, {
            products: cart.products,
        });

        return res.status(200).json({
            message: "cart updated",
            data: cart,
        });



    } catch (err) {
      next(err);
    }
  }
);


// Remove a product from cart

cartRouter.delete("/:productId", async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        //  check if in database
        const carts = await db.getAll("carts");

        const cart = carts.find(
            (cart) => cart.userId === userId
        );
        // if not cart
        if (!cart) {
            return res.status(404).json({
                error: "cart not found",
            });
        }
         // return all products except it
        cart.products = cart.products.filter(
            (item) => item.id !== productId
        );

        // update in Data base
        await db.update("carts", cart.id, {
            products: cart.products,
        });

        return res.status(200).json({
            message: "product removed from cart",
        });



    } catch (err) {
      next(err);
    }
  }
);