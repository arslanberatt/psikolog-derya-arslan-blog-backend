const express = require("express");
const router = express.Router();
const {
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
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

router.get("/", getAllExperiences);
router.post("/", protect, adminOnly, createExperience);
router.put("/:id", protect, adminOnly, updateExperience);
router.delete("/:id", protect, adminOnly, deleteExperience);

module.exports = router;
