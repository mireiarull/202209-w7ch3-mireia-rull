import express from "express";
import {
  createItem,
  deleteItem,
  getUserItems,
} from "../../controllers/itemControllers/itemControllers.js";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: path.join("assets", "images"),
});

// eslint-disable-next-line new-cap
const itemsRouter = express.Router();

itemsRouter.get("/list", getUserItems);
itemsRouter.post("/create", upload.single("image"), createItem);
itemsRouter.delete("/delete", deleteItem);

export default itemsRouter;
