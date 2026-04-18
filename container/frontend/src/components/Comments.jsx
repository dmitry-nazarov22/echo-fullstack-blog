import { Box, Button, List, ListItem, Typography } from "@mui/material";
import api from "../api/axios";
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Comments({ comments, setComments }) {
    /** State for logged in user ID to use for posting */
    const { userId } = useContext(AuthContext);
    /**
     * Handles comment deletion when delete button is pressed.
     *
     * Sends HTTP request to delete comment and handles state management by
     * by filtering out deleted comment.
     *
     * @param {int} commentId Comments ID
     */
    const handleCommentDelete = async (commentId) => {
        try {
            await api.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`);
            setComments(prev => prev.filter(p => p.id !== commentId));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Box sx={{ margin:"10px", display:"flex", flexDirection:"column", alignItems:"baseline", width:"60vw" }}>
            <List>
                {comments.map((comment) => (
                    <ListItem key={comment.id} sx={{ background:"#fafafa", margin:"20px", border:"solid 1px #e2e2e2", borderRadius:"5px", display:"flex", flexDirection:"column", alignItems:"baseline", width:"50vw", padding:"5px" }}>
                        <Typography variant="h6">@{comment.username}</Typography>
                        <Typography sx={{ fontSize:"medium" }}>{comment.body}</Typography>
                        <Typography sx={{ fontSize:"small", color:"#b3b3b3" }}>{comment.created_at}</Typography>

                        <Box sx={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
                            <Box className='button-container-left'></Box>
                            <Box sx={{ display:"flex", alignSelf:'flex-end', margin:"10px" }}>
                                {Number(userId) === Number(comment.user_id) ? (
                                    <Button onClick={() => handleCommentDelete(comment.id)}><DeleteIcon /></Button>
                                ) : (
                                    <></>
                                )}
                            </Box>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}
