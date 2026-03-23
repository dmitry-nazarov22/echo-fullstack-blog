import { useState, useEffect } from 'react'
import Posts from "../components/Posts";

export default function Home({
    posts,
    setPosts,
    fetchPosts,
    fetchPostsByUserId,
    createPost,
    deletePost,
    editPost,
}) {
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
            <Posts
                posts={posts}
                setPosts={setPosts}
                fetchPostsByUserId={fetchPostsByUserId}
                deletePost={deletePost}
                editPost={editPost}
            />
        </div>
    );
}
