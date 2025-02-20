import express from "express";
import { forgetPassword, getUserDetails, login, resetPassword, singUp } from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",singUp);
router.post("/login",login);
router.get("/get-user-details",authMiddleware,getUserDetails);
router.post("/resetpassword",authMiddleware,resetPassword);
router.post("/forgetpassword",forgetPassword);


export default router;