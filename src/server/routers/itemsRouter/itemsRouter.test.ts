import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import environment from "../../../loadEnvironment";
import type { Credentials } from "../../../types";
import bcrypt from "bcryptjs";
import User from "../../../database/models/User";
import connectDatabase from "../../../database";
import type { ItemStructure } from "../../../database/models/Item";
import Item from "../../../database/models/Item";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  await Item.deleteMany();
});

describe("Given a GET method and '/items/list' endpoint", () => {
  describe("When it recevies a userId from the username mireia and password '123456'", () => {
    test("Then it should respond with a status 200 and a list of the user's items", async () => {
      const expectedStatus = 200;

      const user: Credentials = {
        username: "mireia",
        password: "123456",
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser: Credentials = {
        username: user.username,
        password: hashedPassword,
      };

      const databaseUser = await User.create(newUser);

      const token = jwt.sign(
        { username: user.username, id: databaseUser._id },
        environment.jwtSecret
      );

      const userItem: ItemStructure = {
        item: "bag",
        owner: databaseUser._id,
        image: "bag.jpg",
      };

      await Item.create(userItem);

      const response = await request(app)
        .get("/items/list")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("items");
      expect(response.body.items[0]).toHaveProperty("item", "bag");
    });
  });
});
