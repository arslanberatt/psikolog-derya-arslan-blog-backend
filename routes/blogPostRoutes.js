const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getPostByTag,
  searchPosts,
  incrementView,
  likePost,
  getTopPosts,
} = require("../controllers/blogPostController");
const { protect } = require("../middlewares/authMiddleware");

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res.status(403).json({ message: "Sadece adminler girebilir!" });
  }
};

router.post("/", protect, adminOnly, createPost);
router.get("/", getAllPosts);
router.get("/slug/:slug", getPostBySlug);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);
router.get("/tag/:tag", getPostByTag);
router.get("/search", searchPosts);
router.post("/:id/view", incrementView);
router.post("/:id/like", protect, likePost);
router.post("/trending", getTopPosts);

module.exports = router;
