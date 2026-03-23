import { useEffect, useState } from "react";
import Posts from "./Posts";

export default function Profile({ fetchPostsByUserId, fetchUserById, deletePost, editPost }) {
    const [userPosts, setUserPosts] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const loadUserData = async () => {
            const user = await fetchUserById(5);
            setUsername(user.username);
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