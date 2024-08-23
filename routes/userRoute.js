import { Router } from "express";
import {signup, login, logout} from "../controllers/userController.js"
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

// sercured routes
router.route('/logout').get(verifyJWT, logout);

export default router;