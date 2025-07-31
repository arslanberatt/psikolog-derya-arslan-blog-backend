const BlogPost = require("../models/BlogPost");

const createPost = async (req, res) => {
  try {
    const { title, content, coverImageUrl, tags, isDraft } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

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
        .replace(/ç/g, "c")
        .replace(/ğ/g, "g")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ş/g, "s")
        .replace(/ü/g, "u")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
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
    const post = await BlogPost.findOne({ slug: req.params.slug }).populate(
      "author",
      "name profileImageUrl"
    );
    if (!post)
      return res.status(404).json({ message: "Böyle bir post bulunamadı!" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};

const getPostByTag = async (req, res) => {
  try {
    const posts = await BlogPost.find({
      tags: req.params.tag,
      isDraft: false,
    }).populate("author", "name profileImageUrl");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};

const searchPosts = async (req, res) => {
  try {
    const q = req.query.q;
    const posts = await BlogPost.find({
      isDraft: false,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }).populate("author", "name profileImageUrl");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};

const incrementView = async (req, res) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ message: "Görüntülendi +1" });
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};

const likePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
    res.json({ message: "Beğenildi +1" });
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};

const getTopPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({
      isDraft: false,
    })
      .sort({ views: -1, likes: -1 })
      .limit(5);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server'da sorun var." }, error);
  }
};

const getLastPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({
      isDraft: false,
    })
      .populate("author", "name profileImageUrl") // Resim ve yazar bilgisi eklendi
      .sort({ updatedAt: -1 })
      .limit(3);
    res.json(posts);
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
  getLastPosts,
};
