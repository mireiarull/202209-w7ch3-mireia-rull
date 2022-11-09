import type { Response } from "express";
import Item from "../../database/models/Item.js";
import type { CustomRequest } from "../../types";

export const getUserItems = async (req: CustomRequest, res: Response) => {
  const { userId } = req;

  const items = await Item.find({ owner: userId });

  res.status(200).json({ items });
};
