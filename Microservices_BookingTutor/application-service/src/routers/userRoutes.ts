import express from "express";

import {
  getUsers,
  updateUser,
} from "../controllers/userController";


const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.put("/:userId", updateUser);

export default userRoutes;
