import dotenv from "dotenv";
import express from "express";
import DB from "./db.js";
import { decodeCredential } from "./webauthn_server/index.js";

// Set up express to parse json body data into req.body
dotenv.config();
const app = express();
app.use(express.json());

// Allow the client to send a passwordless credential (public key)
app.post("/api/register/credential", (req, res, next) => {
  decodeCredential(req.body.credential);
  res.json({ success: true, message: "registered" });
});

// Serve the client front-end files
app.use(express.static("client"));

// Start the server on the configured port
const port = process.env.EXPRESS_PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Initialize the DB (Mongo in our case)
const myDB = new DB();
myDB.initialize();
myDB.run().catch(console.dir);
