const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const memoryRoutes = require("./routes/memoryRoutes");

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

// Memory API
app.use("/api/memories", memoryRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log(
      "MongoDB connection error:",
      error.message
    );
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message:
      "AI Memory Vault 2.0 Backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});