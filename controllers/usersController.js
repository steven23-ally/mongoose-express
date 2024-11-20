import User from "../models/userModel.js";
import bcrypt from "bcrypt";

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

    res.status(200).send("logged in succesfully");
  } catch (error) {
    res.status(500).send({ error });
  }
};
