import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../AuthContext';
// import { isLoggedIn } from '../auth';

function ProfilePage() {
  const { id } = useParams(); // user id in URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
//   const loggedIn = isLoggedIn();
  const { token, userId } = useAuth();   // new
  const loggedIn = !!token;

  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, postsRes, meRes] = await Promise.all([
        API.get(`/users/${id}`),
        API.get('/posts', { params: { authorId: id } }),
        loggedIn ? API.get('/users/me') : Promise.resolve({ data: null }),
      ]);

      setUser(userRes.data);
      setPosts(postsRes.data);

      if (meRes.data) {
        const me = meRes.data;
        const followingIds = me.following?.map((u) => u.toString?.() || u) || [];
        setIsFollowing(followingIds.includes(id));
      }
    } catch (err) {
      console.error('Profile load error', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await API.post(`/users/${id}/unfollow`);
        setIsFollowing(false);
      } else {
        await API.post(`/users/${id}/follow`);
        setIsFollowing(true);
      }
      await loadData();
    } catch (err) {
      console.error('Follow toggle error', err.response?.data || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>

        {user.avatarUrl && (
         <img
           src={user.avatarUrl}
           alt={user.username}
           style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
         />
       )}

      <h1>{user.username}</h1>
      <p>{user.bio || 'No bio yet.'}</p>
      <p>
        Followers: {user.followers?.length || 0} · Following:{' '}
        {user.following?.length || 0}
      </p>

      {loggedIn && (
        <button onClick={handleFollowToggle}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}

      {loggedIn && userId === user._id && (
        <p>
          <Link to="/profile/edit">Edit Profile</Link>
        </p>
      )}


      <hr />

      <h2>Posts by {user.username}</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul>
        {posts.map((p) => (
          <li key={p._id} className="post-card">
            <h3 className="post-card-title">{p.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfilePage;
