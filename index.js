const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("Connection Error: "));
db.on("open", () => console.log("Successfully connected to MongoDB"));

const userRoutes = require("./routes/userRoute");
app.use("/", userRoutes);

const postRoutes = require("./routes/postRoute");
app.use("/", postRoutes);

const PORT = 4000;
app.listen(PORT, () => "Listening on Port: " + PORT);
