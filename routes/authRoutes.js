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
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary env eksik:", {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      });
      return res.status(500).json({ message: "Sunucu yapılandırması eksik (Cloudinary)." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenmedi! 'image' alanı ile gönderin." });
    }

    const base64 = req.file.buffer?.toString("base64");
    if (!base64) {
      console.error("Boş buffer veya base64 üretilemedi.", { size: req.file.size, mimetype: req.file.mimetype });
      return res.status(400).json({ message: "Geçersiz dosya içeriği." });
    }
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "psikolog-derya-arslan",
      resource_type: "image",
    });

    return res
      .status(200)
      .json({ imageUrl: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload hatası:", error.message);
    return res
      .status(500)
      .json({ message: "Resim yükleme başarısız.", error: error.message });
  }
});

module.exports = router;
