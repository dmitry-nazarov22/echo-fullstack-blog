import { useState, useEffect, useContext } from 'react'
import Posts from "../components/Posts";
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Input } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export default function Home({
    posts,
    setPosts,
    fetchPosts,
    fetchPostsByUserId,
    createPost,
    deletePost,
    editPost,
}) {
    /** State for forms text value. */
    const [form, setForm] = useState("");
    /** State for logged in user ID to use for posting */
    const { userId } = useContext(AuthContext);
    /** State for navigating through views */
    const navigate = useNavigate();

    /**
     * Changes form state when forms input-area value changes.
     *
     * @param {Event} e event of changing the text in the input field.
     */
    const handleChange = (e) => {
        setForm(e.target.value);
    };

    /**
     * Handles submit button pressing.
     *
     * Calls createPost with new Post body and user_id to send HTTP request.
     * e.preventDefault() doesn't allow Browsers deafult behavior. In this case updating page on submitting.
     * Changes are handled by states.
     *
     * @param {Event} e event of pressing the button
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (userId == null) return navigate('/login');

        const newPost = {
            user_id: userId,
            body: form,
        };

        createPost(newPost);

        setForm("");
    };

    /**
     * Fetches posts on first initialization of the page.
     */
    useEffect(() => {
        fetchPosts();
    }, []);

    return <Container sx={{ color:"black" }}>
        <form className="form-inline" onSubmit={handleSubmit}>
            <Input sx={{ minWidth:"50vw", border:"solid 1px #e2e2e2", borderRadius:"2px" }} type="text" placeholder="Write your post here..." onChange={handleChange} required />
            <Button type="submit"><SendIcon /></Button>
        </form>
        <Posts
            posts={posts}
            setPosts={setPosts}
            fetchPostsByUserId={fetchPostsByUserId}
            deletePost={deletePost}
            editPost={editPost}
        />
    </Container>
}
