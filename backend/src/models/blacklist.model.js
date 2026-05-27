const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Blacklist = mongoose.model(
  "Blacklist",
  blacklistSchema
);

module.exports = Blacklist;