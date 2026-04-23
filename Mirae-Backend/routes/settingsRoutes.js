const express = require("express");
const {
  getSettings,
  updateSettings,
  resetSettings,
  clearData
} = require("../controllers/settingsController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);
router.post("/reset", protect, resetSettings);
router.post("/clear-data", protect, clearData);

module.exports = router;
