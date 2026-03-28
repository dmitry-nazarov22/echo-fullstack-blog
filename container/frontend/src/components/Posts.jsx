import axios from 'axios';
import { useEffect, useState } from "react";
import Post from "./Post";

export default function Posts({ posts,
    setPosts,
    deletePost,
    editPost,
}) {
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [commentingId, setCommentingId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [firstComments, setFirstComments] = useState({});
    const [selectedPostId, setSelectedPostId] = useState(null);

    const startEditing = (post) => {
        setEditingId(post.id);
        setEditText(post.body);
    }

    const saveEditing = async (id) => {
        await editPost(id, editText);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, body: editText } : p));
        setEditingId(null);
    }

    const startCommenting = (post) => {
        setCommentingId(post.id);
        setCommentText("");
    }

    const cancelCommenting = () => {
        setCommentingId(null);
        setCommentText("");
    }

    const postComment = async (user_id) => {
        try {
            axios.post(`${import.meta.env.VITE_API_URL}/comments`,
                {
                    post_id: commentingId, user_id: user_id, body: commentText }
            )
            setCommentingId(null);
        } catch (err) {
            console.error(err);
        }
    }

    const handleDelete = async (id) => {
        await deletePost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
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

    const fetchFirstComment = async (post_id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/post/first/${post_id}`);
            setFirstComments(prev => ({
                ...prev, [post_id]: res.data[0]
            }))
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        posts.forEach(post => {
            if (!firstComments[post.id]) {
                fetchFirstComment(post.id);
            }
        })
    }, [posts])

    return (
        <>
        <ul>
            {posts.map((post) => (
                <li key={post.id} className='post-card' onClick={() => {
                    setSelectedPostId(post.id);
                }}>

                    <p className='post-card-username'>{post.username}</p>

                    {editingId === post.id ? (
                            <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            />
                        ) : (
                            <p className='post-card-body'>{post.body}</p>
                        )
                    }
                    <p className='post-card-date'>{post.created_at}</p>
                    <div className="button-container">
                        <div className='button-container-left'>
                            <button onClick={() => handleLike(post.id, 5)}>Like</button>
                            <p>{post.likes}</p>
                            {commentingId === post.id ? (
                                <>
                                    <button onClick={() => cancelCommenting()}>Cancel</button>
                                    <textarea value={commentText} onChange={(e) => {
                                            setCommentText(e.target.value);
                                            setCommentingId(post.id);
                                        }} placeholder='Write your comment here...'>
                                    </textarea>
                                    <button onClick={() => postComment(5)}>Post</button>
                                </>
                            ) : (<button onClick={() => startCommenting(post)}>Comment</button>)
                            }
                        </div>
                        <div className='button-container-right'>
                            {editingId === post.id ? (
                                <button onClick={() => saveEditing(post.id)}>Save</button>
                            ) : (
                                <button className='button-edit' onClick={() => startEditing(post)}>Edit</button>
                            )}
                            <button className='button-delete' onClick={() => handleDelete(post.id)}>Delete</button>
                        </div>
                    </div>
                    <div>
                        {firstComments[post.id] ? (
                        <>
                            <div className='comment-card'>
                                <p className='comment-username'>{firstComments[post.id].username} commented:</p>
                                <p className='comment-body'>{firstComments[post.id].body}</p>
                                <p className='comment-date'>{firstComments[post.id].created_at}</p>
                            </div>
                        </>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    {selectedPostId === post.id ? (
                        <div onClick={(e) => { e.stopPropagation() }}>
                        {/* stopPropagation doesn't trigger li-elements onClick when clicking on <Post /> */}
                            <Post post={post} setPosts={setPosts} closePost={() => setSelectedPostId(null)} />
                        </div>

                    ) : ( <div></div>
                    )}
                </li>
            ))}
        </ul>
        </>
    );
}