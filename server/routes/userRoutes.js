const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Get public profile by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow a user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentId = req.user._id.toString();

    if (targetId === currentId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyFollowing = req.user.following.some(
      (id) => id.toString() === targetId
    );

    if (alreadyFollowing) {
      return res.status(400).json({ message: 'Already following' });
    }

    // update current user
    req.user.following.push(targetId);
    await req.user.save();

    // update target user
    targetUser.followers.push(currentId);
    await targetUser.save();

    res.json({ message: 'Followed', followingCount: req.user.following.length });
  } catch (err) {
    console.error('Follow error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a user
router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentId = req.user._id.toString();

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user.following = req.user.following.filter(
      (id) => id.toString() !== targetId
    );
    await req.user.save();

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentId
    );
    await targetUser.save();

    res.json({ message: 'Unfollowed', followingCount: req.user.following.length });
  } catch (err) {
    console.error('Unfollow error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { bio, avatarUrl } = req.body;

    if (bio !== undefined) {
      req.user.bio = bio;
    }
    if (avatarUrl !== undefined) {
      req.user.avatarUrl = avatarUrl;
    }

    await req.user.save();

    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      bio: req.user.bio,
      avatarUrl: req.user.avatarUrl,
      followers: req.user.followers,
      following: req.user.following,
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
