import app from "./app";
import type { Express } from "express";

app.disable("x-powered-by");

const startServer = async (app: Express, port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on("error", (error) => {
      reject(error);
    });
  });

export default startServer;
