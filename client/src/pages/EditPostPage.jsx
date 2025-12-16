import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/posts/${id}`);
        const post = res.data;
        setForm({
          title: post.title || '',
          content: post.content || '',
          tags: post.tags ? post.tags.join(', ') : '',
        });
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load post';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setError('');
      const tagsArray = form.tags
        ? form.tags.split(',').map((t) => t.trim())
        : [];

      await API.put(`/posts/${id}`, {
        title: form.title,
        content: form.content,
        tags: tagsArray,
      });

      showToast('success', 'Post updated');
      navigate(`/posts/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update post';
      setError(msg);
      showToast('error', msg);
    }
  };

  if (!token) {
    navigate('/login');
    return null;
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Post</h1>
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
        rows={6}
        value={form.content}
        onChange={handleChange}
      />
      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
      />

      <button onClick={handleSave}>Save Changes</button>{' '}
      <button
        style={{ marginLeft: '8px' }}
        onClick={() => navigate(`/posts/${id}`)}
      >
        Cancel
      </button>
    </div>
  );
}

export default EditPostPage;
