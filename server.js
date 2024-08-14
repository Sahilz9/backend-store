const express = require("express");
const router = require("./src/route/userRouter");
const connectDB = require("./src/config/mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const url = process.env.DB_URL;
app.use(cors());
app.use(express.json());
app.use("/movie", router);
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("Home Route");
});

app.listen(8080, async () => {
  try {
    await connectDB(url);
  } catch (error) {
    console.log(error);
  }
});
