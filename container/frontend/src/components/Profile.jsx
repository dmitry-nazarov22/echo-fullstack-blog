import { useContext, useEffect, useState } from "react";
import Posts from "./Posts";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import Comments from './Comments';

export default function Profile({ fetchPostsByUserId, fetchUserById, deletePost, editPost }) {
    /** State for all posts made by user. */
    const [userPosts, setUserPosts] = useState([]);
    /** State for all comments made by user */
    const [userComments, setUserComments] = useState([]);
    /** State for user to display info in profile */
    const [user, setUser] = useState({});
    /** Boolean value referencing state of editing */
    const [editing, setEditing] = useState(false);
    /** Text of description while editing */
    const [descriptionText, setDescriptionText] = useState("");
    /** State for the description, to update afer editing */
    const [description, setDescription] = useState("");
    /** State to display tabs of either posts, likes or comments made by user displayed in profile */
    const [activeTab, setActiveTab] = useState("posts")
    /** State for logged in user ID to use for posting */
    const { userId } = useContext(AuthContext);
    /** State for navigating through views */
    const navigate = useNavigate();

    /**
     * Sending HTTP request to save the new description.
     */
    const saveDescription = async () => {
        try {
            await api.patch("/users/description", {
                description: descriptionText
            })
            setDescription(descriptionText);
            setEditing(false);
            setDescriptionText("");
        } catch (err) {
            console.error(err);
        }
    }

    const fetchCommentsByUser = async (id) => {
        try {
            const res = await api.get(`/comments/user/${id}`)
            setUserComments(res.data);
        } catch (err) {
            console.error(err);
        }
    }

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
            const res = await fetchUserById(userId);
            setUser(res);
            setDescription(res.description);

            const posts = await fetchPostsByUserId(userId);
            setUserPosts(posts);

            fetchCommentsByUser(userId);
        };
        loadUserData();
    }, []);

    return (
        <>
            {userId === null ? (
                <>
                <div className="container">
                    <h2>You're not logged in</h2>
                    <div className="not-logged-buttons">
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/register')}>Register</button>
                    </div>
                </div>
                </>
            ) : (
                <>
                <div className='container'>
                    <h2>@{user.username}</h2>
                    <div className="description-container">
                        {editing === false ? (
                            <>
                                <p>{description}</p>
                                <button onClick={() => setEditing(true)}>Edit description</button>
                            </>
                        ) : (
                            <>
                                <textarea value={descriptionText} onChange={(e) => {
                                        setDescriptionText(e.target.value);
                                    }} placeholder='Write your description here...'>
                                    </textarea>
                                    <button onClick={(e) => {
                                        saveDescription();
                                        e.stopPropagation();
                                    }}>Save</button>
                                    <button onClick={() => { setEditing(false) }}>Cancel</button>
                            </>
                        )}
                    </div>
                    <div className="tab-buttons">
                        <button onClick={() => setActiveTab("posts")}>Posts</button>
                        <button onClick={() => setActiveTab("comments")}>Comments</button>
                    </div>
                    {activeTab === "posts" && (
                        <Posts
                            posts={userPosts}
                            setPosts={setUserPosts}
                            fetchPostsByUserId={fetchPostsByUserId}
                            deletePost={deletePost}
                            editPost={editPost}
                        />
                    )}

                    {activeTab === "comments" && (
                        <Comments comments={userComments} setComments={setUserComments} />
                    )}
                </div>
            </>
            )}
        </>
    );
}