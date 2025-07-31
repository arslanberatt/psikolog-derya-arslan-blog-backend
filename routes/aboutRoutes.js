const express = require("express");
const router = express.Router();
const {
  getAbout,
  updateAbout,
  // createAbout,
} = require("../controllers/aboutController");
const { protect } = require("../middlewares/authMiddleware");

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Bu işlemi yapma yetkiniz bulunmamaktadır!" });
  }
};
// router.post("/", protect, adminOnly, createAbout);
router.get("/", getAbout);
router.put("/:id", protect, adminOnly, updateAbout);

module.exports = router;
