import express from "express";
import { getUserItems } from "../../controllers/itemControllers/itemControllers.js";
import auth from "../../middlewares/auth.js";

// eslint-disable-next-line new-cap
const itemsRouter = express.Router();

itemsRouter.get("/list", auth, getUserItems);

export default itemsRouter;
