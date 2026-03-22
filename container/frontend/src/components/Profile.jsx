import { useEffect, useState } from "react";

export default function Profile({ fetchPostsByUserId, fetchUserById }) {
    const [userPosts, setUserPosts] = useState([]);
    const [username, setUsername] = useState("");

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
            <h2>{username}</h2>
            <ul>
                {userPosts.map((post) => (
                    <li key={post.id} className='post-card'>
                        <p className='post-card-username'>{post.username}</p>
                        <p className='post-card-body'>{post.body}</p>
                        <p className='post-card-date'>{post.created_at}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}