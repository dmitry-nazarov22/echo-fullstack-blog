import api from '../api/axios';
import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Posts({ posts,
    setPosts,
    deletePost,
    editPost,
}) {
    /** State for posts ID that is being edited. */
    const [editingId, setEditingId] = useState(null);
    /** State for the text in the edit field. */
    const [editText, setEditText] = useState("");
    /** State for the posts ID that is being commented. */
    const [commentingId, setCommentingId] = useState(null);
    /** State for the text in the comment field. */
    const [commentText, setCommentText] = useState("");
    /** State for all first Comments; saved as { post_id: comment }. */
    const [firstComments, setFirstComments] = useState({});
    /** State for selected post, which will be maximised to full screen. */
    const [selectedPostId, setSelectedPostId] = useState(null);
    /** State for logged in user ID to use for posting */
    const { userId } = useContext(AuthContext);
    /** State for username to display in the profile. */
    const [username, setUsername] = useState("");
    /** State for navigating through views */
    const navigate = useNavigate();

    /**
     * When edit button is pressed this method sets posts ID as editingID and will
     * input posts body into the text field.
     *
     * @param {Object} post Post object
     */
    const startEditing = (post) => {
        setEditingId(post.id);
        setEditText(post.body);
    }

    /**
     * Handles saving editing of the post by calling editPost function.
     *
     * Also calls setPosts again and changes old value with the edited value.
     *
     * @param {int} id ID of the post to edit.
     */
    const saveEditing = async (id) => {
        await editPost(id, editText);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, body: editText } : p));
        setEditingId(null);
    }

    /**
     * Handles comment button pressing so only one post is commented at a time.
     *
     * Sets commenting ID to post id and resets commentText.
     *
     * @param {Object} post post Object
     */
    const startCommenting = (post) => {
        if (userId == null) return navigate('/login');
        setCommentingId(post.id);
        setCommentText("");
    }

    /**
     * Handles cancel button when commenting. Resetting states.
     */
    const cancelCommenting = () => {
        setCommentingId(null);
        setCommentText("");
    }

    /**
     *  Sends POST request to save comment to database. Uses states for comment.
     *
     * @param {int} user_id Users ID.
     */
    const postComment = async (user_id) => {
        try {
            api.post(`${import.meta.env.VITE_API_URL}/comments`,
                {
                    post_id: commentingId, user_id: user_id, body: commentText }
            )
            setCommentingId(null);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Handles delete button pressing.
     *
     * TODO: verification of the press; now it deletes instantly.
     *
     * @param {int} id Comments ID.
     */
    const handleDelete = async (id) => {
        await deletePost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
    }

    /**
     * Sends POST request to save like to database.
     *
     * @param {Object} like Like Object containing post_id and user_id
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
     * Sends DELETE request to delete like from the database.
     *
     * @param {Object} like Like Object containing post_id and user_id
     */
    const deleteLike = async (like) => {
        try {
        await api.delete(`${import.meta.env.VITE_API_URL}/likes/post/${like.post_id}/user/${like.user_id}`);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Sends GET request to find out if user has liked a post to do the correct operation
     * afterwards.
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
     * Handles like-button click.
     *
     * Checks if user has liked the post or not. If user has liked the post
     * deletes the like on click, if not, then saves the like by calling set functions.
     *
     * Also handles likes displaying with both operations updating only the liked/unliked
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
     * Sends GET request to get latest comment of the post.
     * Sets the firstComments state with post_id as the key.
     *
     * @param {int} post_id Posts ID
     */
    const fetchFirstComment = async (post_id) => {
        try {
            const res = await api.get(`${import.meta.env.VITE_API_URL}/comments/post/first/${post_id}`);
            setFirstComments(prev => ({
                ...prev, [post_id]: res.data[0]
            }))
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Everytime posts state is changed fetches latest comments for all posts,
     * which don't have them yet, and load username to compare with post author
     * -> if author is same as active user display edit and delete buttons
     */
    useEffect(() => {
        posts.forEach(post => {
            if (!firstComments[post.id]) {
                fetchFirstComment(post.id);
            }
        })

        const loadUserData = async () => {
            try {
                const res = await api.get(`/users/${userId}`);
                setUsername(res.data.username);
            } catch (err) {
                console.error(err);
            }
        };
        loadUserData();
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
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setEditText(e.target.value)}
                            />
                        ) : (
                            <p className='post-card-body'>{post.body}</p>
                        )
                    }
                    <p className='post-card-date'>{post.created_at}</p>
                    <div className="button-container">
                        <div className='button-container-left'>
                            <button onClick={(e) => {
                                handleLike(post.id, userId);
                                e.stopPropagation();
                            }}>Like</button>
                            <p>{post.likes}</p>
                            {commentingId === post.id ? (
                                <>
                                    <button onClick={(e) => {
                                        cancelCommenting();
                                        e.stopPropagation();
                                    }}>Cancel</button>
                                    <textarea onClick={(e) => e.stopPropagation()} value={commentText} onChange={(e) => {
                                        setCommentText(e.target.value);
                                        setCommentingId(post.id);
                                    }} placeholder='Write your comment here...'>
                                    </textarea>
                                    <button onClick={(e) => {
                                        postComment(userId);
                                        e.stopPropagation();
                                    }}>Post</button>
                                </>
                            ) : (<button onClick={(e) => {
                                startCommenting(post);
                                e.stopPropagation();
                            }}>Comment</button>)
                            }
                        </div>
                        <div className='button-container-right'>
                            {username === post.username ? (
                                <>
                                    {editingId === post.id ? (
                                        <button onClick={(e) => {
                                            saveEditing(post.id);
                                            e.stopPropagation();
                                        }}>Save</button>
                                    ) : (
                                        <button className='button-edit' onClick={(e) => {
                                            startEditing(post)
                                            e.stopPropagation();
                                        }}>Edit</button>
                                    )}
                                    <button className='button-delete' onClick={(e) => {
                                        handleDelete(post.id);
                                        e.stopPropagation();
                                    }}>Delete</button>
                                </>
                            ) : (
                                <>
                                </>
                            )}
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