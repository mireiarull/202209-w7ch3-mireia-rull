import express from "express";
import { registerUser } from "../controllers/userControllers.js";
import { userRegisterSchema } from "../schemas/userCredentialsSchema.js";
import { validate } from "express-validation";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

export default userRouter;
