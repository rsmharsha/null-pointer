import { Blog } from "../models/Blogs.js";

// GET /blogs
export const getBlogs = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    // Only approved blogs are visible to guests
    const filter = { status: "approved" };

    // Optional tag filter: GET /blogs?tag=javascript
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /blogs/:slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    // Guest can only read approved blogs
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "approved",
    }).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};