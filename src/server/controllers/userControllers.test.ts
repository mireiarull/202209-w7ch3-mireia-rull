import type { Credentials } from "../../types";
import type { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { registerUser } from "./userControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

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
