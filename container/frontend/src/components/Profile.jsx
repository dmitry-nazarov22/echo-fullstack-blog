import { useEffect, useState } from "react";
import Posts from "./Posts";

export default function Profile({ fetchPostsByUserId, fetchUserById, deletePost, editPost }) {
    /** State for all posts made by user. */
    const [userPosts, setUserPosts] = useState([]);
    /** State for username to display in the profile. */
    const [username, setUsername] = useState("");

    /**
     * On initialization loads user data:
     * - all posts made by user
     * - user object for username (and description when added)
     * - in the future: likes and comments made by user
     */
    useEffect(() => {
        const loadUserData = async () => {
            const user = await fetchUserById(5);
            setUsername(user.username);

            const posts = await fetchPostsByUserId(5);
            setUserPosts(posts);
        };
        loadUserData();
    }, []);

    return (
        <div className='container'>
            <h2>@{username}</h2>
            <p>Description to profile will be here</p>
            <Posts
                posts={userPosts}
                setPosts={setUserPosts}
                fetchPostsByUserId={fetchPostsByUserId}
                deletePost={deletePost}
                editPost={editPost}
            />
        </div>
    );
}