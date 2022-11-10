import type { Credentials } from "../../types";
import type { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { loginUser, registerUser } from "./userControllers";
import CustomError from "../../CustomError/CustomError";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const token = jwt.sign({}, "secret");

describe("Given a register controller", () => {
  const registerBody: Credentials = {
    username: "mireia",
    password: "1234",
  };

  describe("When it receives a username 'mireia' and a password '1234'", () => {
    test("Then it should invoke its method status with 201 and its method json with the user id and the username", async () => {
      const expectedStatus = 201;

      const req: Partial<Request> = {
        body: registerBody,
      };

      User.create = jest.fn().mockResolvedValueOnce(registerBody);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });
});

describe("Given a loginUser controller", () => {
  const loginBody: Credentials = {
    username: "mireia",
    password: "paco123",
  };

  const req: Partial<Request> = {
    body: loginBody,
  };

  describe("When it receives a request with an invalid username", () => {
    test("Then it should invoke the next function with a username error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);
      const usernameError = new CustomError(
        "Username not found",
        401,
        "Wrong credentials"
      );

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(usernameError);
    });
  });

  describe("When it receives a valid username 'mireia' and the wrong password", () => {
    test("Then it should invoke the next function with a password error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(loginBody);
      const passwordError = new CustomError(
        "Password is incorrect",
        401,
        "Wrong credentials"
      );

      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(passwordError);
    });
  });

  describe("when it receives a valid username 'mireia' and a valid password '1234'", () => {
    test("Then it should invoke the response method with a 200 status and its json method with a token", async () => {
      const user = {
        username: "admin",
        password: "admin",
      };
      const userId = new mongoose.Types.ObjectId();
      const expectedStatus = 200;
      req.body = user;
      User.findOne = jest.fn().mockResolvedValueOnce({ ...user, _id: userId });
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      jwt.sign = jest.fn().mockReturnValueOnce(token);

      await loginUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });
});
