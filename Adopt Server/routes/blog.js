const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  addBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");

/* MULTER CONFIG */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/blogs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES */
router.post("/add-blog", upload.single("image"), addBlog);
router.get("/blogs", getBlogs);
router.put("/blog/:id", updateBlog);
router.delete("/blog/:id", deleteBlog);

module.exports = router;
