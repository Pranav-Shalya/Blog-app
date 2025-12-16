import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

function EditProfilePage() {
  const navigate = useNavigate();
  const { token, userId } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ bio: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadMe = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users/me');
        const user = res.data;
        setForm({
          bio: user.bio || '',
          avatarUrl: user.avatarUrl || '',
        });
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load profile';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setError('');
      await API.put('/users/me', form);
      showToast('success', 'Profile updated');
      navigate(`/users/${userId}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setError(msg);
      showToast('error', msg);
    }
  };

  if (!token) return null;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>Bio</label>
      <textarea
        name="bio"
        rows={3}
        value={form.bio}
        onChange={handleChange}
      />

      <label>Avatar URL</label>
      <input
        name="avatarUrl"
        placeholder="https://..."
        value={form.avatarUrl}
        onChange={handleChange}
      />

      <button onClick={handleSave}>Save</button>{' '}
      <button onClick={() => navigate(`/users/${userId}`)}>Cancel</button>
    </div>
  );
}

export default EditProfilePage;
