// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import API from '../api';

// function FeedPage() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       const res = await API.get('/posts');
//       setPosts(res.data);
//     };
//     load();
//   }, []);

//   return (
//     <div>
//       <h1>All Posts</h1>
//       <ul>
//         {posts.map((p) => (
//           <li key={p._id}>
//             <Link to={`/posts/${p._id}`}>{p.title}</Link> by {p.author?.username}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FeedPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function FeedPage() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const res = await API.get('/posts');
    setPosts(res.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const toggleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/like`);
      await loadPosts(); // reload list to update like counts
    } catch (err) {
      console.error('Like error', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>All Posts</h1>
      <ul>
        {posts.map((p) => (
          <li key={p._id} className="post-card">
            <h2 className="post-card-title">
              <Link to={`/posts/${p._id}`}>{p.title}</Link>
            </h2>
            <p className="post-card-meta">
              by{' '}
              {p.author ? (
               <Link to={`/users/${p.author._id}`}>
                 {p.author.username}
               </Link>
             ) : (
                'Unknown'
             )}
            </p>
            <button onClick={() => toggleLike(p._id)}>
              👍 {p.likes?.length || 0}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeedPage;

