const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    // New fields for media support
    messageType: {
      type: String,
      enum: ["text", "emoji", "gif", "image"], // Extend as needed
      default: "text"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // For additional data like GIF dimensions, emoji codes, etc.
      default: {}
    },
    // Optional: For tracking read receipts
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
messageModel.index({ content: "text" });

const Message = mongoose.model("Message", messageModel);
module.exports = Message;