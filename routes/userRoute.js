import express from "express";
import User from "../models/userModel.js";
import { createUser, userlogin } from "../controllers/usersController.js";
import { getAllUsers } from "../controllers/usersController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
router.get("/get",getAllUsers)
router.post("/create",createUser);
router.post("/login",userlogin)
export default router;
