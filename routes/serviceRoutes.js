const express = require("express");
const router = express.Router();
const {
  getAllServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
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

router.get("/", getAllServices);
router.post("/", protect, adminOnly, createService);
router.put("/:id", protect, adminOnly, updateService);
router.delete("/:id", protect, adminOnly, deleteService);

module.exports = router;
