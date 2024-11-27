import express from "express";
import User from "../models/userModel.js";
import { createUser, updatePasswordById, updateUserNameById, userlogin } from "../controllers/usersController.js";import { getAllUsers } from "../controllers/usersController.js";
// import { validateUser } from "../middelwares/validateUser.js";
import { validateJWT } from "../middelwares/jwtmiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
router.get("/get",validateJWT,getAllUsers)
router.post("/create",createUser);
router.post("/login",userlogin)
router.patch("/:id",validateJWT,updateUserNameById)
router.patch("/update-password/:id",validateJWT,updatePasswordById)
export default router;
