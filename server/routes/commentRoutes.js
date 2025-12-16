const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get comments for a post (public)
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: 1 }); // oldest first

    res.json(comments);
  } catch (err) {
    console.error('Get comments error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to a post (auth)
router.post('/post/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
    });

    const populated = await comment.populate('author', 'username avatarUrl');

    res.status(201).json(populated);
  } catch (err) {
    console.error('Create comment error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle like on a comment (auth)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      id: comment._id,
      likesCount: comment.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error('Toggle like comment error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
