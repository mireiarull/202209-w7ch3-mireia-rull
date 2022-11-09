import "../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { Credentials } from "../../types.js";
import User from "../../database/models/User.js";
import CustomError from "../../CustomError/CustomError.js";
import type { Error } from "mongoose";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ user: { id: newUser._id }, username });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      409,
      "Error saving user"
    );
    next(customError);
  }
};
