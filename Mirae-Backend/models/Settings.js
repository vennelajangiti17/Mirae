const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    notifications: {
      followUpReminders: { type: Boolean, default: true },
      deadlineAlerts: { type: Boolean, default: true },
      interviewReminders: { type: Boolean, default: true },
      notificationsEnabled: { type: Boolean, default: true },
      remindersEnabled: { type: Boolean, default: true },
      browserNotifications: { type: Boolean, default: true },
      notificationTiming: {
        type: String,
        enum: ["1day", "3days", "custom"],
        default: "1day"
      },
      customReminderHours: { type: Number, default: 6, min: 1, max: 72 }
    },
    preferences: {
      defaultStatus: {
        type: String,
        enum: ["Saved", "Applied", "Interviewing", "Offer", "Rejected"],
        default: "Saved"
      },
      defaultTags: {
        type: [String],
        default: ["Remote", "Internship", "Urgent"]
      },
      duplicateDetection: { type: Boolean, default: true },
      autoTagging: { type: Boolean, default: false }
    },
    appearance: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      accentStyle: { type: String, enum: ["gold", "soft-gold"], default: "gold" },
      cardLayout: { type: String, enum: ["compact", "comfortable"], default: "comfortable" }
    },
    privacy: {
      securityActivityAlerts: { type: Boolean, default: true },
      profileDiscoverability: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
