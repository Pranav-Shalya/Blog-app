import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../auth';
import { useToast } from '../ToastContext';

import API from '../api';

function NewPostPage() {
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createPost = async () => {
    try {
      setError('');
      const tagsArray = form.tags
        ? form.tags.split(',').map((t) => t.trim())
        : [];
      const res = await API.post('/posts', {
        title: form.title,
        content: form.content,
        tags: tagsArray,
      });
      showToast('success', 'Post created successfully');
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
        const msg = err.response?.data?.message || 'Create post failed';
      setError(msg);
      showToast('error',msg);
    }
  };

  if (!isLoggedIn()) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <h1>New Post</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        name="content"
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
      />
      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
      />
      <button onClick={createPost}>Publish</button>
    </div>
  );
}

export default NewPostPage;
