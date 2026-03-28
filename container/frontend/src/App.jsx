import axios from 'axios';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Profile from "./components/Profile";

function App() {
  /**
   * State for all posts to display in the feed.
   */
  const [posts, setPosts] = useState([]);

  /**
   * Fetches all posts and sets them in a state.
   */
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Fetches posts by user ID to show in Profile.
   *
   * @param {int} user_id ID of the user.
   * @returns Array of posts of given user.
   */
  const fetchPostsByUserId = async (user_id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${user_id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  /**
   * Fetches user object by user ID to display name and description in profile.
   *
   * @param {int} id ID of the user
   * @returns User object.
   */
  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Create and save a post into the database.
   *
   * @param {Object} newPost Object containing user_id and body text.
   */
  const createPost = async (newPost) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, {
        ...newPost
      });

      setPosts(prev => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Delete post from database.
   *
   * @param {int} id ID of the post
   */
  const deletePost = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${id}`);
      setPosts(prev => prev.filter(post => post.id != id));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Edit post in the database.
   *
   * @param {int} id ID of the post.
   * @param {String} editText Text to display in the post.
   */
  const editPost = async (id, editText) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        body: editText
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home
              posts={posts}
              setPosts={setPosts}
              fetchPosts={fetchPosts}
              fetchPostsByUserId={fetchPostsByUserId}
              createPost={createPost}
              deletePost={deletePost}
              editPost={editPost}
              />} />
            <Route path="/profile" element={<Profile
              fetchUserById={fetchUserById}
              fetchPostsByUserId={fetchPostsByUserId}
              editPost={editPost}
              deletePost={deletePost}
              />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App
