import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { ItemStructure } from "../../../database/models/Item";
import Item from "../../../database/models/Item";
import type { CustomRequest } from "../../../types";
import { createItem, deleteItem } from "./itemControllers";
import fs from "fs/promises";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a createItem controller", () => {
  describe("When it receives a request with a new item 'bag' from a registered user", () => {
    test("Then it should invoke its response method with the bag item and 201 status", async () => {
      const expectedStatus = 201;

      const newItem: ItemStructure = {
        item: "bag",
        owner: new mongoose.Types.ObjectId(),
        image: "img",
      };

      const body: Partial<ItemStructure> = {
        image: "coso.jpg",
      };

      const file: Partial<Express.Multer.File> = {
        filename: body.image,
        originalname: "",
      };

      const req: Partial<CustomRequest> = {
        body: newItem,
        userId: "1234",
        file: file as Express.Multer.File,
      };

      Item.create = jest.fn().mockResolvedValueOnce(newItem);

      fs.rename = jest.fn().mockResolvedValueOnce(undefined);

      await createItem(req as CustomRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ newItem });
    });
  });
});

describe("Given a deleteItem controller", () => {
  describe("When it receives a request with an item id 1 from a registered user", () => {
    test("Then it should invoke its response method with the item and 200 status", async () => {
      const expectedStatus = 200;

      const itemBody = {
        id: "636d32de136296680a03914f",
        image: "coso.jpg",
      };

      const req: Partial<Request> = {
        body: itemBody,
      };
      Item.findById = jest.fn().mockResolvedValueOnce(itemBody);
      Item.deleteOne = jest.fn().mockResolvedValueOnce(itemBody);

      fs.unlink = jest.fn().mockResolvedValueOnce(undefined);

      await deleteItem(req as CustomRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ item: itemBody });
    });
  });
});
