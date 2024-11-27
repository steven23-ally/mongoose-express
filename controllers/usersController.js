import { request } from "express";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const user = new User(req.body);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    await user.save();
    res.status(201).send("User created");
  } catch {
    res.status(500).send({ message: "error: User not found" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const getAllUsers = await User.find({}, { password: 0 });
    res.status(200).send(getAllUsers);
  } catch {
    res.status(500).send({ message: "err User not found" });
  }
};

export const userlogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(401).send("please provide username and password");
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("username does not exist");

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).send("Invalid password");
    }
    const token = jwt.sign({ id: user._id },  process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "login succesful", token });
  } catch (error) {
    res.status(500).send({ error });
  }
};
export const updateUserNameById = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUsername } = req.body;
    const user = await User.findByIdAndUpdate(id, { username: newUsername });
    if (!user) {
      return res.status(404).send("user not found");
    }
    res.status(200).send("username updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updatePasswordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
      return res.status(400).send("please provide old and new password");
    }
    if (newPassword === oldPassword) {
      return res
        .status(400)
        .send("new password cannot be the same as old passowrd");
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(401).send("invalid old passowrd");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send("password updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
