import express from "express";
import morgan from "morgan";
import userRouter from "./routers/usersRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use("/users", userRouter);

export default app;
