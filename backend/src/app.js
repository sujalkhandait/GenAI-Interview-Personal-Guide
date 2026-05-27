const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");




const app = express();

// ================= MIDDLEWARES =================

import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gen-ai-interview-personal-guide.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

app.use(cookieParser());

// ================= ROUTES =================
const reportRoutes = require("./routes/report.routes");

const authRoutes = require("./routes/auth.routes");

app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= 404 HANDLER =================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

module.exports = app;
