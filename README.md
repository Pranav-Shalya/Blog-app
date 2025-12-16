# MERN Blog App

Full‑stack blogging platform built with the MERN stack. Users can create posts, like and comment, follow other users, and see a personalized feed. The app includes JWT authentication, profile pages, and a responsive React frontend.

## Live Demo

- Frontend: https://blog-app-silk-six.vercel.app/
- Backend API: https://blog-app-uf7w.onrender.com/api/health

## Features

- User authentication with signup, login, and JWT-based protected routes.
- Create, edit, and delete blog posts with tags.
- Like posts and add comments.
- Follow/unfollow other users and view a personalized feed.
- User profiles with bio, avatar, followers, and following counts.
- Toast notifications for success/error and confirmation before deleting posts.


## Tech Stack

**Frontend**
- React (SPA)
- React Router
- Axios
- Context API for auth and toast state

**Backend**
- Node.js, Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for auth
- bcrypt for password hashing

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas


## Project Structure

- `/client` – React frontend
  - `/src`
    - `App.js` – main app and routes
    - `AuthContext.jsx` – authentication context (login/logout, token, userId)
    - `ToastContext.jsx` – global toast notifications
    - `pages/` – Feed, Login, Signup, Post detail, Edit post, Profile, Edit profile
    - `api.js` – Axios instance (points to deployed API)

- `/server` – Node/Express backend
  - `server.js` – Express app entrypoint
  - `/models` – User, Post, Comment schemas
  - `/routes` – auth, posts, users, feed routes
  - `/middleware` – auth middleware for protected routes


Setup and environment

## Getting Started (Local)

### 1. Clone repo

git clone https://github.com/Pranav-Shalya/Blog-app.git
cd Blog-app

### 2. Backend setup

cd server
npm install

Create a `.env` file in `/server`:

PORT=4000
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_jwt_secret>

Run the backend:

npm start

### 3. Frontend setup

In another terminal:

cd client
npm install

Update `src/api.js` if needed so `baseURL` matches your local API, for example:

const API = axios.create({
baseURL: 'http://localhost:4000/api',
});


Run the frontend:

npm start

undefined
Usage

## Usage

- Sign up, then log in to get access to creating posts, liking, commenting, and following users.
- Create a new post from the “New Post” page.
- Edit or delete your own posts from the post detail page (delete is confirmed via dialog).
- Update your bio and avatar from the “Edit Profile” page; your avatar appears on your profile and posts.
- View “My Feed” to see posts from users you follow.
