const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const authController = require(
  "../controllers/auth.controller"
);


// ================= REGISTER =================

router.post(
  "/register",
  authController.register
);


// ================= LOGIN =================

router.post(
  "/login",
  authController.login
);


// ================= LOGOUT =================

router.post(
  "/logout",
  authMiddleware,
  authController.logout
);


// ================= GET CURRENT USER =================

router.get(
  "/me",
  authMiddleware,
  authController.getMe
);


module.exports = router;