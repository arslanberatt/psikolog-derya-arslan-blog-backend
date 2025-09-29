const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  deleteUser,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddlware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/:id", protect, deleteUser);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenmedi!" });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "psikolog-derya-arslan",
      resource_type: "image",
    });

    return res
      .status(200)
      .json({ imageUrl: result.secure_url, publicId: result.public_id });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Resim yükleme başarısız.", error: error.message });
  }
});

module.exports = router;
