import { Router } from "express";
import { createProduct, deleteProduct, getProductDetails, product, update } from "../controllers/productController.js";


const router = Router();

router.post('/createProduct', createProduct);

router.get('/product', product);
router.put('/upadateProduct/:id', update);
router.delete('/deleteProduct/:id', deleteProduct);
router.get('/getProductDetails/:id', getProductDetails);

export default router;