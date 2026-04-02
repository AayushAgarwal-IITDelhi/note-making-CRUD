const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("mongodb+srv://DummyUser:DummyUser@dummycluster.os0qx7h.mongodb.net/?appName=DummyCluster")
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.send("LaLa");
});


const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const notesRoutes = require("./routes/notes");
app.use("/notes", notesRoutes);

app.listen(3000, () => {
  console.log("Server running");
});