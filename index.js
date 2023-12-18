const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

const mongoose = require("./config/db_connection");

const db = mongoose.connection;
db.on("error", () => console.log("Connection Error: "));
db.on("open", () => console.log("Successfully connected to MongoDB"));

const userRoutes = require("./routes/userRoute");
app.use("/api", userRoutes);

const postRoutes = require("./routes/postRoute");
app.use("/api", postRoutes);

const PORT = 4000;
app.listen(PORT, () => "Listening on Port: " + PORT);
