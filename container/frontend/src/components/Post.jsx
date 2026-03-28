import axios from 'axios';
import { useEffect, useState } from "react";
import Comments from './Comments';

export default function Post({ post, setPosts, closePost }) {
    /** State for comment field text value. */
    const [commentText, setCommentText] = useState("");
    /** State for comments array. */
    const [comments, setComments] = useState([]);

    /**
     * Fetches all comments by posts ID to display them under the post.
     *
     * @param {int} post_id Posts ID
     */
    const fetchCommentsByPost = async (post_id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/post/${post_id}`);
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
        try {
            axios.post(`${import.meta.env.VITE_API_URL}/comments`,
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
        await axios.post(`${import.meta.env.VITE_API_URL}/likes`, {
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/likes/post/${like.post_id}/user/${like.user_id}`);
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
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/likes/post/${post_id}/user/${user_id}`);
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
        <div className='post-container'>
            <div className='post-card'>
                <button className='close-post-button' onClick={() => closePost()}>Close</button>
                <p className='post-card-username'>{post.username}</p>
                <p className='post-card-body'>{post.body}</p>
                <p className='post-card-date'>{post.created_at}</p>
                <div className="button-container">
                    <div className='button-container-left'>
                        <button onClick={() => handleLike(post.id, 5)}>Like</button> {/* HARD CODED VALUE; will be updated when auth is added */}
                        <p>{post.likes}</p>
                        <textarea value={commentText} onChange={
                            (e) => setCommentText(e.target.value)
                            } placeholder='Write your comment here...'>
                        </textarea>
                        <button onClick={() => postComment(5)}>Post comment</button> {/* HARD CODED VALUE; will be updated when auth is added */}
                    </div>
                </div>
            </div>
            <Comments comments={comments} setComments={setComments} />
        </div>
    );
}