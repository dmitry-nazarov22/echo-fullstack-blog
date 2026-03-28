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
    /**
     * State for forms text value.
     */
    const [form, setForm] = useState("");
    /**
     * State for message to be displayed under the form. Not used yet.
     */
    const [message, setMessage] = useState("");

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
     * Calls createPost with new Post body and (hard coded atp) user_id to send HTTP request.
     * e.preventDefault() doesn't allow Browsers deafult behavior. In this case updating page on submitting.
     * Changes are handled by states.
     *
     * @param {Event} e event of pressing the button
     */
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

    /**
     * Fetches posts on first initialization of the page.
     */
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='container'>
            <form className="form-inline" onSubmit={handleSubmit}>
                <input className='form-textarea' type="text" placeholder="Write your post here..." onChange={handleChange} required />

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
