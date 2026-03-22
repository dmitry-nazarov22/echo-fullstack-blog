import axios from 'axios';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Profile from "./components/Profile";

function App() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPostsByUserId = async (user_id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${user_id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

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

  const deletePost = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${id}`);
      setPosts(prev => prev.filter(post => post.id != id));
    } catch (err) {
      console.error(err);
    }
  }

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
            <Route path="/" element={<Home posts={posts} fetchPosts={fetchPosts} createPost={createPost} deletePost={deletePost} />} />
            <Route path="/profile" element={<Profile fetchUserById={fetchUserById} fetchPostsByUserId={fetchPostsByUserId} editPost={editPost} deletePost={deletePost} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App
