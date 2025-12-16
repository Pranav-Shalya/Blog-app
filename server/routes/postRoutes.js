const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE post (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      author: req.user._id,
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all posts (public, basic list)
router.get('/', async (req, res) => {
  try {
    const { authorId } = req.query;
    const filter = {};
    if (authorId) {
      filter.author = authorId;
    }
    
    const posts = await Post.find(filter)
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single post by id (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatarUrl');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('Get post error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Personalized feed: posts from followed authors
router.get('/feed/me', auth, async (req, res) => {
  try {
    const followingIds = req.user.following;

    const posts = await Post.find({ author: { $in: followingIds } })
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error('Feed error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE post (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : [];

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Update post error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE post (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// TOGGLE LIKE on a post (auth)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      id: post._id,
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error('Toggle like error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Personalized feed: posts from followed authors
router.get('/feed/me', auth, async (req, res) => {
  try {
    const followingIds = req.user.following;

    const posts = await Post.find({ author: { $in: followingIds } })
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error('Feed error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
