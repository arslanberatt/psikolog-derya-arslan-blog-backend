const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res.status(403).json({ message: "Sadece adminler girebilir!" });
  }
};

router.get("/", protect, adminOnly, getDashboardSummary);

module.exports = router;
