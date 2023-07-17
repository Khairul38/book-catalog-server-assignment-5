import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { Server } from "http";

process.on("uncaughtException", error => {
  console.log("Uncaught Exception is detected", error);
  process.exit(1);
});

let server: Server;

async function dbConnect() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connected successfully");

    server = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log("Failed to connect database", error);
  }

  process.on("unhandledRejection", error => {
    if (server) {
      server.close(() => {
        console.log(
          "Unhandled Rejection is detected, we are closing our server.....",
          error
        );
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

dbConnect();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close();
  }
});
