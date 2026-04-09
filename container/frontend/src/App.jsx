import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import api from './api/axios';

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthContext from './context/AuthContext';

function App() {
  const { userId, setUserId } = useContext(AuthContext);
  /**
   * State for all posts to display in the feed.
   */
  const [posts, setPosts] = useState([]);

  /**
   * Fetches all posts and sets them in a state.
   */
  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts`);
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
      const res = await api.get(`/posts/${user_id}`);
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
      const res = await api.get(`/users/${id}`);
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
      const res = await api.post(`/posts`, {
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
      await api.delete(`/posts/${id}`);
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
      await api.patch(`/posts/${id}`, {
        body: editText
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Save user to the database.
   *
   * @param {Object} user user to be saved.
   */
  const createUser = async (user) => {
      await api.post(`/users/register`, {
        ...user
      });
  }

  useEffect(() => {
    async function checkLoggedUserId() {
      try {
        const res = await api.get("/users/loggedin");
        setUserId(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (userId != null) {
      checkLoggedUserId();
    }
  }, [])

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register createUser={createUser} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App
