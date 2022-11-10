import type { Response } from "express";
import type { ItemStructure } from "../../../database/models/Item.js";
import Item from "../../../database/models/Item.js";
import type { CustomRequest, ItemId } from "../../../types";
import fs from "fs/promises";
import path from "path";

export const getUserItems = async (req: CustomRequest, res: Response) => {
  const { userId } = req;

  const items = await Item.find({ owner: userId });

  res.status(200).json({ items });
};

export const createItem = async (req: CustomRequest, res: Response) => {
  const { userId } = req;

  const { item } = req.body as ItemStructure;

  await fs.rename(
    path.join("assets", "images", req.file.filename),
    path.join("assets", "images", req.file.filename + req.file.originalname)
  );

  const newItem = await Item.create({
    item,
    image: req.file.filename + req.file.originalname,
    owner: userId,
  });

  res.status(201).json({ newItem });
};

export const deleteItem = async (req: CustomRequest, res: Response) => {
  const { id } = req.body as ItemId;

  const item = await Item.findById(id);

  await fs.unlink(path.join("assets", "images", item.image));

  await Item.deleteOne({ id });

  res.status(200).json({ item });
};
