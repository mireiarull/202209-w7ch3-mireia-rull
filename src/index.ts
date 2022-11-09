import "./loadEnvirontment.js";
import connectDatabase from "./database/index.js";
import startServer from "./server/index.js";
import chalk from "chalk";
import debugCreator from "debug";
import { mongo } from "mongoose";
import app from "./server/app.js";
import { port, mongoDbUrl } from "./loadEnvironments";

const { MongoServerError } = mongo;

const debug = debugCreator("robots: server: root");

try {
  await startServer(app, +port);
  debug(chalk.yellow(`Server listening on: http://localhost:${port}`));
  await connectDatabase(mongoDbUrl);
  debug(chalk.green("Connection to database was successfull"));
} catch (error: unknown) {
  if (error instanceof MongoServerError) {
    debug(
      chalk.red(`Error connecting to the database ${(error as Error).message}`)
    );
  } else {
    debug(chalk.red(`Error starting the server ${(error as Error).message}`));
  }
}
