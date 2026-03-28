import axios from 'axios';
import { useEffect, useState } from "react";

export default function Post({ post, setPosts, closePost }) {
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);

    const fetchCommentsByPost = async (post_id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/post/${post_id}`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const postComment = async (user_id) => {
        try {
            axios.post(`${import.meta.env.VITE_API_URL}/comments`,
                {
                    post_id: post.id, user_id: user_id, body: commentText }
            )
        } catch (err) {
            console.error(err);
        }
    }

    const addLike = async (like) => {
        try {
        await axios.post(`${import.meta.env.VITE_API_URL}/likes`, {
            ...like
        });
        } catch (err) {
            console.error(err);
        }
    }

    const deleteLike = async (like) => {
        try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/likes/post/${like.post_id}/user/${like.user_id}`);
        } catch (err) {
            console.error(err);
        }
    }

    const isPostLiked = async (post_id, user_id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/likes/post/${post_id}/user/${user_id}`);
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }

    const handleLike = async (post_id, user_id) => {
        const isLiked = await isPostLiked(post_id, user_id);
        if (isLiked) {
            await deleteLike({ post_id, user_id });
            setPosts(prev => prev.map(p => p.id === post_id ? { ...p, likes: (Number(p.likes) || 0) - 1 } : p));
        } else {
            await addLike({ post_id, user_id });
            setPosts(prev => prev.map(p => p.id === post_id ? { ...p, likes: (Number(p.likes) || 0) + 1 } : p));
        }
    }

    const handleCommentDelete = async (commentId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`);
            setComments(prev => prev.filter(p => p.id !== commentId));
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchCommentsByPost(post.id);
    }, [])

    return (
        <div className='post-container'>
            <div className='post-card'>
                <button className='close-post-button' onClick={() => closePost()}>Close</button>
                <p className='post-card-username'>{post.username}</p>
                <p className='post-card-body'>{post.body}</p>
                <p className='post-card-date'>{post.created_at}</p>
                <div className="button-container">
                    <div className='button-container-left'>
                        <button onClick={() => handleLike(post.id, 5)}>Like</button>
                        <p>{post.likes}</p>
                        <textarea value={commentText} onChange={
                            (e) => setCommentText(e.target.value)
                            } placeholder='Write your comment here...'>
                        </textarea>
                        <button onClick={() => postComment(5)}>Post comment</button>
                    </div>
                </div>
            </div>
            <div className='comments-section'>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id} className='comment-card'>
                            <p className='comment-username'>@{comment.username}</p>
                            <p className='comment-body'>{comment.body}</p>
                            <p className='comment-date'>{comment.created_at}</p>

                            <div className="button-container">
                                <div className='button-container-left'></div>
                                <div className='button-container-right'>
                                    <button className='button-delete' onClick={() => handleCommentDelete(comment.id)}>Delete</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}