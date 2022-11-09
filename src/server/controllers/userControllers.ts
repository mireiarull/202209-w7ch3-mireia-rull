import "../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { Credentials } from "../../types.js";
import User from "../../database/models/User.js";
import CustomError from "../../CustomError/CustomError.js";
import type { Error } from "mongoose";
import environment from "../../loadEnvironment.js";
import jwt from "jsonwebtoken";

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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  const user = await User.findOne({ username });

  if (!user) {
    const error = new CustomError(
      "Username not found",
      401,
      "Wrong credentials"
    );
    next(error);
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    const error = new CustomError(
      "Password is incorrect",
      401,
      "Wrong credentials"
    );
    next(error);
    return;
  }

  const token = jwt.sign({ username, id: user._id }, environment.jwtSecret, {
    expiresIn: "2d",
  });

  res.status(200).json({ token });
};
