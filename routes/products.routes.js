import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/vallidatebody.js";
import { checkAuth } from "../middleware/checkauth.js";
import { checkRole } from "../middleware/checkrole.js";
import { productSchema } from "../schema/product.schema.js";


export const productsRouter = express.Router();

const db = createDB();




productsRouter.get("/", async (req, res, next) => {
  try {
    const search = req.query.search;

    const products = await db.getAll("products");

    if (search) {
      const filteredProducts = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
        );
      });

      return res.status(200).json({
        data: filteredProducts,
      });
    }

    return res.status(200).json({
      data: products,
    });
  } catch (err) {
    next(err);
  }
});


productsRouter.post("/" , checkAuth , checkRole("merchant") , validateBody(productSchema) ,  async (req, res, next) =>{
     try {
      const productData = req.body;

      const newProduct = await db.create(
        "products",
        productData
      );

      return res.status(201).json({
        message: "product created successfully",
        data: newProduct,
      });
    } catch (err) {
      next(err);
    }
  }
);



productsRouter.get("/:product_id" ,  async (req, res, next) =>{
     try {

        const productId = req.params.product_id;

        const product = await db.getById("products", productId);

        if (!product) {
            return res.status(404).json({
                error: "product not found",
           });
        }

        return res.status(200).json({
            data: product,
         });
    } catch (err) {
      next(err);
    }
  }
)




productsRouter.patch( "/:product_id", checkAuth, checkRole("merchant") , validateBody(productSchema.partial()) ,  async (req, res, next)=>{
    try{
        const productId = req.params.product_id;

        const product = await db.getById("products", productId);

        if (!product) {
            return res.status(404).json({
                error: "product not found",
           });
        }


        await db.update("products" , productId , req.body)
        const newProduct = await db.getById("products", productId);

        return res.status(200).json({
            "message": "product updated successfully",
            data: newProduct,
         });



    }catch(err){
        next(err);
    }

})



productsRouter.delete( "/:product_id", checkAuth, checkRole("merchant") , async (req, res, next)=>{
    try{
        const productId = req.params.product_id;

        const product = await db.getById("products", productId);

        if (!product) {
            return res.status(404).json({
            error: "product not found",
            });
        }

        await db.delete("products", productId);

        return res.status(204).send();

    }catch(err){
        next(err);
    }

})
