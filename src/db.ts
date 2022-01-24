import "dotenv/config";
import mongoose from "mongoose";
import {
  databaseUrl,
  databaseHost,
  databaseName,
  databasePort,
} from "./config";

// Build the connection string
let dbURI =
  databaseUrl || `mongodb://${databaseHost}:${databasePort}/${databaseName}`;
let done = false;
console.log(
  databaseUrl || `mongodb://${databaseHost}:${databasePort}/${databaseName}`
);
mongoose
  .connect(dbURI)
  .then(() => {
    console.info("Connected Successfully");
    done = true;
  })
  .catch((err) => {
    console.info("Connection with MongoDB error");
    console.error(err);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", () => {
  console.info("Mongoose default connection open to " + dbURI);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  console.error("Mongoose default connection error: " + err);
});

export default done;
