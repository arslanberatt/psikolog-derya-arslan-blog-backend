const BlogPost = require("../models/BlogPost");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  try {
    const { title, content, coverImageUrl, tags, isDraft } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const newPost = new BlogPost({
      title,
      slug,
      content,
      coverImageUrl,
      tags,
      author: req.user._id,
      isDraft,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Blog oluşturulurken hata oluştu. ${error}` });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Böyle bir post bulunamadı!" });
    if (
      post.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Bu oturumu güncellemek için yetkili değil!" });
    }
    const updateData = req.body;
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }
    const updatePost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatePost);
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Böyle bir post bulunamadı!" });
    await post.deleteOne();
    res.json({ message: "Blog silindi!" });
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
const getAllPosts = async (req, res) => {
  try {
    const status = req.query.status || "published";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status === "published") filter.isDraft = false;
    else if (status === "draft") filter.isDraft = true;

    const posts = await BlogPost.find(filter)
      .populate("author", "name profileImageUrl")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const [totalCount, allCount, publishedCount, draftCount] =
      await Promise.all([
        BlogPost.countDocuments(filter),
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: false }),
        BlogPost.countDocuments({ isDraft: true }),
      ]);
    res.json({
      posts,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      counts: {
        all: allCount,
        published: publishedCount,
        draft: draftCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
const getPostBySlug = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
const getPostByTag = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
const searchPosts = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
const incrementView = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
const likePost = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
const getTopPosts = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};
module.exports = {
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
};
