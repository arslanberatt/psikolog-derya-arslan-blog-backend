const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, bio, adminAccessToken } =
      req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Böyle bir kulanıcı zaten var!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let role = "member";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      bio,
      role,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      bio: user.bio,
      role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Geçersiz email yada parola!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ message: "Geçersiz email yada parola!" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu Hatası: ", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Sunucu Hatası: ", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Böyle bir kullanıcı bulunamadı!" });
    }

    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Bu işlemi yapma yetkiniz bulunmamaktadır!",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  } catch (error) {
    console.error("Kullanıcı silme hatası:", error.message);
    res.status(500).json({
      message: "Kullanıcı silinirken sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  deleteUser,
};
