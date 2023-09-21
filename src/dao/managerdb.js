import mongoose from "mongoose";
import { cartModel } from "./models/entities.model.js";
import { productModel } from "./models/entities.model.js";
import { Router } from "express";
const router = Router();

mongoose
  .connect(
    "mongodb+srv://kaufmannEcommerce:kaufmannEcommerce@kaufmanndb.wakqh7a.mongodb.net/?retryWrites=true&w=majority&dbName=KaufmannDB"
  )
  .then((event) => console.log("conecto!"))
  .catch((error) => console.log(error));

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findOne({ cartId }).exec();
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send("Carrito no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1;

    const cart = await cartModel.findOne({ cartId }).exec();

    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    const existingProduct = cart.products.find(
      (p) => p.productId === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

router.post("/carts/product/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const quantity = 1;

    const product = await productModel.findOne({ productId }).exec();

    if (!product) {
      res.status(404).send("Producto no encontrado");
      return;
    }

    const cartlast = await cartModel
      .findOne()
      .sort({ cartId: -1 })
      .select("cartId")
      .exec();

    const nextcartId = cartlast ? cartlast.cartId + 1 : 1;

    const newCart = new cartModel({
      cartId: nextcartId,
      products: [{ productId, quantity }],
    });
    await newCart.save();

    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).send("***Error en el servidor");
  }
});

const validateAddProduct = [
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


const validateUpdateProduct = [
 (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productModel.find().limit(limit).lean().exec();
    res.json(products);
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productModel.findOne({ productId }).exec();
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

router.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;

    const existingProduct = await productModel
      .findOne({ code: newProduct.code })
      .exec();
    if (existingProduct) {
      res.status(400).send("El producto con este código ya existe");
      return;
    }

    const productlast = await productModel
      .findOne()
      .sort({ productId: -1 })
      .select("productId") 
      .exec();

    const nextProductId = productlast ? productlast.productId + 1 : 1;
    const product = new productModel({
      ...newProduct,
      productId: nextProductId,
    });

    try {
      await product.save();
    } catch (error) {
      console.log(error);
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

router.put("/products/:pid", validateUpdateProduct, async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    const product = await productModel.findOne({ productId }).exec();

    if (!product) {
      res.status(404).send("Producto no encontrado");
      return;
    }
    for (const key in updatedProduct) {
      if (updatedProduct.hasOwnProperty(key)) {
        product[key] = updatedProduct[key];
      }
    }
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await productModel.findOne({ productId }).exec();

    if (!product) {
      res.status(404).send("Producto no encontrado");
      return;
    }

    await Product.deleteOne({ productId }).exec();

    res.status(200).send(`Producto con ID ${productId} eliminado`);
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

export default router;
