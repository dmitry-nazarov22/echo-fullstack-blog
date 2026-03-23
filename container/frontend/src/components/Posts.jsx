import axios from 'axios';
import { useState } from "react";

export default function Posts({ posts,
    setPosts,
    deletePost,
    editPost,
}) {
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const startEditing = (post) => {
        setEditingId(post.id);
        setEditText(post.body);
    }

    const saveEditing = async (id) => {
        await editPost(id, editText);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, body: editText } : p));
        setEditingId(null);
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/likes`, {
            ...like
        });
        } catch (err) {
        console.error(err);
        }
    }

    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id} className='post-card'>

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
                            <button>Like</button>
                            <p>{post.likes}</p>
                            <button>Comment</button>
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

                </li>
            ))}
        </ul>
    );
}