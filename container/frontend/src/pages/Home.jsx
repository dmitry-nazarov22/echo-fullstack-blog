import { useState, useEffect } from 'react'

export default function Home({ posts, fetchPosts, createPost, deletePost }) {
    const [form, setForm] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form) {
            setMessage("Post can't be empty!");
        } else {

            const newPost = {
                user_id: 5, // TODO: User-specified id
                body: form,
            };

            createPost(newPost);

            setForm("");
            setMessage("");
        }
    };


    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='container'>
            <form className="form-inline" onSubmit={handleSubmit}>
                <input type="text" placeholder="Write your post here..." onChange={handleChange} required />

                <p>{message}</p>
                <button type="submit">Post</button>
            </form>
            <ul>
                {posts.map((post) => (
                    <li key={post.id} className='post-card'>
                        <p className='post-card-username'>{post.username}</p>
                        <p className='post-card-body'>{post.body}</p>
                        <p className='post-card-date'>{post.created_at}</p>
                        <div className='button-container'>
                            <button className='button-edit'>Edit</button>
                            <button className='button-delete' onClick={() => deletePost(post.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
