import api from "../api/axios";
import { useContext, useEffect, useState } from "react";
import Comments from './Comments';
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';

export default function Post({ post, setPosts, closePost }) {
    /** State for comment field text value. */
    const [commentText, setCommentText] = useState("");
    /** State for comments array. */
    const [comments, setComments] = useState([]);
    /** State for logged in user ID to use for posting */
    const { userId } = useContext(AuthContext);
    /** State for navigating through views */
    const navigate = useNavigate();

    /**
     * Fetches all comments by posts ID to display them under the post.
     *
     * @param {int} post_id Posts ID
     */
    const fetchCommentsByPost = async (post_id) => {
        try {
            const res = await api.get(`${import.meta.env.VITE_API_URL}/comments/post/${post_id}`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Sends POST request to save comment tot the database.
     *
     * @param {int} user_id Users ID
     */
    const postComment = async (user_id) => {
        if (userId == null) return navigate('/login');
        try {
            api.post(`${import.meta.env.VITE_API_URL}/comments`,
                {
                    post_id: post.id, user_id: user_id, body: commentText }
            )
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Sends POST request to save the like to the database.
     *
     * @param {Objct} like Like object containing user_id and post_id
     */
    const addLike = async (like) => {
        try {
        await api.post(`${import.meta.env.VITE_API_URL}/likes`, {
            ...like
        });
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Sends DELETE request to delete the like from the database.
     *
     * @param {Object} like Like object containing user_id and post_id
     */
    const deleteLike = async (like) => {
        try {
        await api.delete(`${import.meta.env.VITE_API_URL}/likes/post/${like.post_id}`);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Sends GET request to find out if post is liked or not by the user.
     *
     * @param {int} post_id Posts ID
     * @param {int} user_id Users ID
     * @returns
     */
    const isPostLiked = async (post_id, user_id) => {
        try {
            const res = await api.get(`${import.meta.env.VITE_API_URL}/likes/post/${post_id}/user/${user_id}`);
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Handles like button press to check if post has already been liked by the user,
     * and deleting the like or adding the like after, with updating only the liked/unliked
     * post and just its like value.
     *
     * At this point code wise getting negative likes is possible, but isPostLiked
     * removes that possibility.
     *
     * @param {int} post_id Posts ID
     * @param {int} user_id Users ID
     */
    const handleLike = async (post_id, user_id) => {
        if (userId == null) return navigate('/login');

        const isLiked = await isPostLiked(post_id, user_id);
        if (isLiked) {
            await deleteLike({ post_id, user_id });
            setPosts(prev => prev.map(p => p.id === post_id ? { ...p, likes: (Number(p.likes) || 0) - 1 } : p));
        } else {
            await addLike({ post_id, user_id });
            setPosts(prev => prev.map(p => p.id === post_id ? { ...p, likes: (Number(p.likes) || 0) + 1 } : p));
        }
    }

    /**
     * Fetch comments to single post when initializing post.
     */
    useEffect(() => {
        fetchCommentsByPost(post.id);
    }, [])

    return (
        <Box sx={{ display:"flex", flexDirection:"column", position:"fixed", inset:"0", justifyContent:"center", alignItems:"center", background:"rgba(255, 255, 255, 0.012)", backdropFilter:"blur(10px)" }}>
            <Box sx={{ background:"#ffffff", padding: "5px", margin:"10px", border:"1px solid #e8e8e8", borderRadius:"5px", display:"flex", flexDirection:"column", alignItems:"baseline", width:"80vw" }}>
                <Button sx={{ alignSelf:"flex-end" }} onClick={() => closePost()}><CloseIcon/></Button>
                <Typography variant="h6">{post.username}</Typography>
                <Typography sx={{ fontSize:"medium" }}>{post.body}</Typography>
                <Typography sx={{ fontSize:"small", color:"#b3b3b3" }}>{post.created_at}</Typography>
                <Box sx={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
                    <Box sx={{ display:"flex", alignSelf:'flex-start', flexDirection:"row", gap:"10px" }}>
                        <Button onClick={() => handleLike(post.id, userId)}><FavoriteBorderIcon /> <Typography>{post.likes}</Typography></Button>
                        <TextField size="small" sx={{ width:"50vw" }} value={commentText} onChange={
                            (e) => setCommentText(e.target.value)
                            } placeholder='Write your comment here...'>
                        </TextField>
                        <Button onClick={() => postComment(userId)}><SendIcon /></Button>
                    </Box>
                </Box>
            </Box>
            <Comments comments={comments} setComments={setComments} />
        </Box>
    );
}