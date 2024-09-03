import express from "express";

const router = express.Router();

import {
  FetchProducts,
  FetchProductById,
} from "../controller/productController.js";

router.get("/", FetchProducts);
router.get("/:id", FetchProductById);

export default router;
