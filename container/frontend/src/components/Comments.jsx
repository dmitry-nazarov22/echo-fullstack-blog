import api from "../api/axios";

export default function Comments({ comments, setComments }) {
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
        <div className='comments-section'>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id} className='comment-card'>
                        <p className='comment-username'>@{comment.username}</p>
                        <p className='comment-body'>{comment.body}</p>
                        <p className='comment-date'>{comment.created_at}</p>

                        <div className="button-container">
                            <div className='button-container-left'></div>
                            <div className='button-container-right'>
                                <button className='button-delete' onClick={() => handleCommentDelete(comment.id)}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
