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

  const createPost = async (newPost) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, {
        ...newPost
      });

      setPosts(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home posts={posts} fetchPosts={fetchPosts} createPost={createPost} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App
