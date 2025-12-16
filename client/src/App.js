// import React, { useState } from 'react';
// import API from './api';

// function App() {
//   const [form, setForm] = useState({ username: '', email: '', password: '' });
//   const [token, setToken] = useState(localStorage.getItem('token') || '');
//   const [feed, setFeed] = useState([]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const signup = async () => {
//     const res = await API.post('/auth/signup', form);
//     setToken(res.data.token);
//     localStorage.setItem('token', res.data.token);
//   };

//   const login = async () => {
//     const res = await API.post('/auth/login', {
//       emailOrUsername: form.email || form.username,
//       password: form.password,
//     });
//     setToken(res.data.token);
//     localStorage.setItem('token', res.data.token);
//   };

//   const loadFeed = async () => {
//     const res = await API.get('/posts/feed/me');
//     setFeed(res.data);
//   };

//   return (
//     <div>
//       <h1>Blog App</h1>

//       <h2>Signup / Login</h2>
//       <input
//         name="username"
//         placeholder="username"
//         value={form.username}
//         onChange={handleChange}
//       />
//       <input
//         name="email"
//         placeholder="email"
//         value={form.email}
//         onChange={handleChange}
//       />
//       <input
//         name="password"
//         placeholder="password"
//         type="password"
//         value={form.password}
//         onChange={handleChange}
//       />
//       <button onClick={signup}>Signup</button>
//       <button onClick={login}>Login</button>

//       <h3>Token: {token ? '✅ stored' : '❌ none'}</h3>

//       <button onClick={loadFeed} disabled={!token}>
//         Load My Feed
//       </button>

//       <ul>
//         {feed.map((post) => (
//           <li key={post._id}>
//             {post.title} by {post.author?.username}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { useAuth } from './AuthContext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FeedPage from './pages/FeedPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NewPostPage from './pages/NewPostPage';
import PostDetailPage from './pages/PostDetailPage';
import { isLoggedIn, logout } from './auth';
import PersonalizedFeedPage from './pages/PersonalizedFeedPage';
import ProfilePage from './pages/ProfilePage';
import EditPostPage from './pages/EditPostPage';
import EditProfilePage from './pages/EditProfilePage';
import './App.css'


const userId = localStorage.getItem('userId');
function App() {
  const { token, userId, logout } = useAuth();
  const loggedIn = !!token;
  return (
   <div className="app-container">
    <Router>
      <nav>
       <Link to="/">Feed</Link> |{' '}
        {loggedIn && <Link to="/new">New Post</Link>} |{' '}
        {loggedIn && <Link to="/feed">My Feed</Link>} |{' '}
        {loggedIn && userId && <Link to={`/users/${userId}`}>My Profile</Link>} |{' '}
        {!loggedIn && <Link to="/login">Login</Link>} |{' '}
        {!loggedIn && <Link to="/signup">Signup</Link>}
        {loggedIn && (
         <>
          {' | '}
          <button
                style={{ background: 'transparent', color: '#e5e7eb' }}
                onClick={logout}
          >
                Logout
          </button>
          {/* <button
           style={{ background: 'transparent', color: '#e5e7eb' }}
           onClick={() => {
            logout();
           localStorage.removeItem('userId');
           window.location.href = '/';
          }}
          >
          Logout
          </button> */}
         </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<FeedPage />} />
         <Route path="/feed" element={<PersonalizedFeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/new" element={<NewPostPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/users/:id" element={<ProfilePage />} />
        <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
      </Routes>
    </Router>
   </div>
  );
}

export default App;

