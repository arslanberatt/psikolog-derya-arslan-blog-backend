const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentComment } = req.body;

    const post = await BlogPost.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Böyle bir post bulunamadı!" });

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null,
    });
    await comment.populate("author", "name profileImageUrl");
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: "Yorum eklenirken bir hata oluştu",
      error: error.message,
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl")
      .sort({ createdAt: 1 });

    const commentMap = {};
    comments.forEach((comment) => {
      comment = comment.toObject();
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        nestedComments.push(commentMap[comment._id]);
      }
    });
    res.json(nestedComments);
  } catch (error) {
    res.status(500).json({
      message: "Yorumlar yüklenirken bir hata oluştu",
      error: error.message,
    });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl")
      .sort({ createdAt: 1 });

    const commentMap = {};
    comments.forEach((comment) => {
      comment = comment.toObject();
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        nestedComments.push(commentMap[comment._id]);
      }
    });
    res.json(nestedComments);
  } catch (error) {
    res.status(500).json({
      message: "Yorumlar yüklenirken bir hata oluştu",
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment)
      return res.status(404).json({ message: "Böyle bir yorum bulunamadı!" });
    await Comment.deleteOne({ _id: commentId });

    await Comment.deleteMany({ parentComment: commentId });
    res.json({ message: "Yorum ve cevapları başarıyla silindi!" });
  } catch (error) {
    res.status(500).json({
      message: "Yorum silinirken bir hata oluştu",
      error: error.message,
    });
  }
};

module.exports = {
  addComment,
  getAllComments,
  getCommentsByPost,
  deleteComment,
};
