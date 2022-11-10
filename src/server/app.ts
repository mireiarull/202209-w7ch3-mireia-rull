import express from "express";
import morgan from "morgan";
import auth from "./middlewares/auth.js";
import { generalError, notFoundError } from "./middlewares/error.js";
import itemsRouter from "./routers/itemsRouter/itemsRouter.js";
import userRouter from "./routers/usersRouter/usersRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use("/users", userRouter);
app.use("/items", auth, itemsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
