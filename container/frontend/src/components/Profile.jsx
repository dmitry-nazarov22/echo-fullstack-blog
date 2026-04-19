import { useContext, useEffect, useState } from "react";
import Posts from "./Posts";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import api from '../api/axios';
import Comments from './Comments';
import { Box, Button, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"

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
    /** ID from parameters; which profile to open. */
    const { id } = useParams();
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
    /**
     * Fetching comments by user to display them in profile.
     *
     * @param {int} id User ID, whose comments are fetched.
     */
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
        const loadUserData = async (id) => {
            const res = await fetchUserById(id);
            setUser(res);
            setDescription(res.description);

            const posts = await fetchPostsByUserId(id);
            setUserPosts(posts);

            fetchCommentsByUser(id);
        };

        loadUserData(id);
    }, []);

    return (
        <>
            {id === "null" ? (
                <>
                <Box sx={{ display:"flex", flexDirection:"column", alignContent:"center", margin:"100px" }}>
                    <Typography variant="h4">You're not logged in</Typography>
                    <Box sx={{ display:"flex", justifyContent:"center", margin:"10px" }}>
                        <Button sx={{ margin:"20px" }} onClick={() => navigate('/login')}>Login</Button>
                        <Button sx={{ margin:"20px" }} onClick={() => navigate('/register')}>Register</Button>
                    </Box>
                </Box>
                </>
            ) : (
                <>
                <Box sx={{ display:"flex", flexDirection:"column", alignContent:"center", margin:"100px" }}>
                    <Typography variant="h4" sx={{ margin:"10px" }}>@{user.username}</Typography>
                    <Box sx={{ display:"flex", justifyContent:"center" }}>
                        {editing === false ? (
                            <>
                                <Typography variant="h5">{description}</Typography>
                                {userId == id ? (
                                        <>
                                            <Button onClick={() => setEditing(true)}><EditIcon /></Button>
                                        </>
                                    ) : (<></>)
                                }
                            </>
                        ) : (
                            <>
                                <TextField value={descriptionText}
                                    onChange={(e) => {
                                        setDescriptionText(e.target.value);
                                    }} placeholder='Write your description here...'
                                    sx={{ width:"60%" }}
                                >
                                    </TextField>
                                    <Button onClick={(e) => {
                                        saveDescription();
                                        e.stopPropagation();
                                    }}>Save</Button>
                                    <Button onClick={() => { setEditing(false) }}>Cancel</Button>
                            </>
                        )}
                    </Box>
                    <Box sx={{ padding:"5px", margin:"50px", borderRadius:"10px", border:"solid 1px", color:"#d4d4d4" }}>
                        <Button sx={{ margin:"20px" }} onClick={() => setActiveTab("posts")}>Posts</Button>
                        <Button sx={{ margin:"20px" }} onClick={() => setActiveTab("comments")}>Replies</Button>
                    </Box>
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
                </Box>
            </>
            )}
        </>
    );
}