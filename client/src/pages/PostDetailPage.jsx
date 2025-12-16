// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import API from '../api';

// function PostDetailPage() {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       const res = await API.get(`/posts/${id}`);
//       setPost(res.data);
//     };
//     load();
//   }, [id]);

//   if (!post) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>{post.title}</h1>
//       <p>by {post.author?.username}</p>
//       <p>{post.content}</p>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useParams,useNavigate, Link } from 'react-router-dom';
import { useToast } from '../ToastContext';
import { useAuth } from '../AuthContext';
import API from '../api';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { showToast} = useToast();
  const { token, userId } = useAuth();
  const navigate = useNavigate();
   const hasToken = !!localStorage.getItem('token');
  
  const loadPost = async () => {
    const res = await API.get(`/posts/${id}`);
    setPost(res.data);
  };

  const loadComments = async () => {
    const res = await API.get(`/comments/post/${id}`);
    setComments(res.data);
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm('Are you sure you want to delete this post?')) {
     return;
    }

   try {
    await API.delete(`/posts/${post._id}`);
      showToast('success', 'Post deleted');
      navigate('/'); // back to feed
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete post';
      showToast('error', msg);
    }
   };


  useEffect(() => {
    loadPost();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitComment = async () => {
    try {
      setError('');
      if (!newComment.trim()) return;
      await API.post(`/comments/post/${id}`, { content: newComment });
      setNewComment('');
      showToast('success', 'Comment added successfully');
      await loadComments();
    } catch (err) {
        const msg=err.response?.data?.message || 'Failed to add comment';
      setError(msg);
      showToast('error',msg);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>
        by{' '}
        {post.author ? (
         <Link to={`/users/${post.author._id}`}>
         {post.author.username}
        </Link>
       ) : (
       'Unknown'
       )}
      </p>

      <p>{post.content}</p>

      <button onClick={async () => {
        try {
         await API.post(`/posts/${post._id}/like`);
         const res = await API.get(`/posts/${post._id}`);
          setPost(res.data);
        } catch (err) {
          console.error('Like error', err.response?.data || err.message);
        }
        }}>
  👍   {post.likes?.length || 0}
      </button>

      {userId && post.author && post.author._id === userId && (
       <>
       {' '}
       <button
        style={{ marginLeft: '8px', backgroundColor: '#dc2626' }}
        onClick={handleDelete}
       >
        Delete
       </button>
       </>
      )}

      {userId && post.author && post.author._id === userId && (
       <>
        {' '}
        <button
           style={{ marginLeft: '8px' }}
           onClick={() => navigate(`/posts/${post._id}/edit`)}
        >
        Edit
        </button>
       </>
      )}




      <hr />

      <h2>Comments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {comments.length === 0 && <p>No comments yet.</p>}

      <ul>
        {comments.map((c) => (
          <li key={c._id}>
            <strong>{c.author?.username || 'Anonymous'}:</strong>{' '}
            {c.content}
          </li>
        ))}
      </ul>

      {hasToken ? (
        <div>
          <h3>Add a comment</h3>
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <br />
          <button onClick={submitComment}>Post Comment</button>
        </div>
      ) : (
        <p>You must be logged in to comment.</p>
      )}
    </div>
  );
}

export default PostDetailPage;
