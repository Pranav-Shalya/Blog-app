import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { isLoggedIn } from '../auth';

function PersonalizedFeedPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        setError('');
        const res = await API.get('/posts/feed/me');
        setPosts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load feed');
      }
    };

    load();
  }, [navigate]);

  return (
    <div>
      <h1>My Feed</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {posts.length === 0 && <p>No posts from people you follow yet.</p>}

      <ul>
        {posts.map((p) => (
          <li key={p._id} className="post-card">
            <h2 className="post-card-title">
              <Link to={`/posts/${p._id}`}>{p.title}</Link>
            </h2>
            <p className="post-card-meta">
              by {p.author?.username || 'Unknown'}
            </p>
            <button
              onClick={async () => {
                try {
                  await API.post(`/posts/${p._id}/like`);
                  const res = await API.get('/posts/feed/me');
                  setPosts(res.data);
                } catch (err) {
                  console.error('Like error', err.response?.data || err.message);
                }
              }}
            >
              👍 {p.likes?.length || 0}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PersonalizedFeedPage;
