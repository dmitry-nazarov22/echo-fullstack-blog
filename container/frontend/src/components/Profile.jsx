import { useEffect, useState } from "react";

export default function Profile({ fetchPostsByUserId, fetchUserById, deletePost, editPost }) {
    const [userPosts, setUserPosts] = useState([]);
    const [username, setUsername] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const startEditing = (post) => {
        setEditingId(post.id);
        setEditText(post.body);
    }

    const saveEditing = async (id) => {
        await editPost(id, editText);
        setUserPosts(prev => prev.map(p => p.id === id ? { ...p, body: editText } : p));
        setEditingId(null);
    }

    const handleDelete = async (id) => {
        await deletePost(id);
        setUserPosts(prev => prev.filter(p => p.id !== id));
    }

    useEffect(() => {
        const loadUserData = async () => {
            const posts = await fetchPostsByUserId(5);
            setUserPosts(posts);

            const user = await fetchUserById(5);
            setUsername(user.username);
        };
        loadUserData();
    }, []);

    return (
        <div className='container'>
            <h2>@{username}</h2>
            <p>Description to profile will be here</p>
            <ul>
                {userPosts.map((post) => (
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
                        <div className='button-container'>
                            {editingId === post.id ? (
                                <button onClick={() => saveEditing(post.id)}>Save</button>
                            ) : (
                                <button className='button-edit' onClick={() => startEditing(post)}>Edit</button>
                            )}
                            <button className='button-delete' onClick={() => handleDelete(post.id)}>Delete</button>
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
}