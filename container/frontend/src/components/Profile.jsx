import { useContext, useEffect, useState } from "react";
import Posts from "./Posts";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile({ fetchPostsByUserId, fetchUserById, deletePost, editPost }) {
    /** State for all posts made by user. */
    const [userPosts, setUserPosts] = useState([]);
    /** State for username to display in the profile. */
    const [username, setUsername] = useState("");
    /** State for logged in user ID to use for posting */
    const { userId } = useContext(AuthContext);
    /** State for navigating through views */
    const navigate = useNavigate();

    /**
     * On initialization loads user data:
     * - all posts made by user
     * - user object for username (and description when added)
     * - in the future: likes and comments made by user
     */
    useEffect(() => {
        if (userId == null) {
            return;
        }
        const loadUserData = async () => {
            const user = await fetchUserById(userId);
            setUsername(user.username);

            const posts = await fetchPostsByUserId(userId);
            setUserPosts(posts);
        };
        loadUserData();
    }, []);

    return (
        <>
            {userId === null ? (
                <>
                <div className="container">
                    <h2>You're not logged in</h2>
                    <div className="button-container"></div>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </div>
                </>
            ) : (
                <>
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
            </>
            )}
        </>
    );
}