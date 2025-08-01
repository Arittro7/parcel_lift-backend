import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("🚚 Connected to DB ⛳");

    server = app.listen(envVars.PORT, () => {
      console.log("Server is Listening to port 5000");
    });

  } catch (error) {
    console.log(error);
  }
};

(async () =>{
  await startServer()
  await seedSuperAdmin()
})()

// ▶️ Handle Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected. Server is shutting down!", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});


// ▶️ Handle Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception happened. Server shutting down!", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});


// ▶️ Handle SIGTERM (Termination Signal from Server/Host)
process.on("SIGTERM", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

