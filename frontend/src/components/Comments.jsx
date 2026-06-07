import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import { useParams } from 'react-router-dom'

function Comments() {

    const [updateText, setUpdateText] = useState('')
    const [updateCommentId, setUpdateCommentId] = useState()
    const [refresh, setRefresh] = useState(false)
    const { postId } = useParams()
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const editCommentRef = useRef()

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const comments = await api.get(`/post/${postId}/comments`)

                setComments(comments.data.comments)

            } catch (e) {
                console.log(e)
            }
        }
        fetchPost()
    }, [postId, refresh])

    const username = localStorage.getItem('username')

    const handleDeleteComment = async (commentId) => {
        try {
            let confirm = window.confirm("you want to delete this comment?")
            if(confirm){
                await api.delete(`/post/${postId}/${commentId}`)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setRefresh(prev => !refresh)
        }
    }

    const handleUpdateComment = async (commentId) => {
        try {
            await api.put(`/post/${postId}/${commentId}`, { content: updateText })
        } catch (e) {
            console.log(e);
        } finally {
            setRefresh(prev => !prev)
            setUpdateCommentId()
        }
    }

    const handleEdit = (commentId, text) => {
        setUpdateCommentId(commentId)
        setUpdateText(text)
        // setTimeout(() => {
        //     editCommentRef.current.focus()
        // }, 100)
    }
    // This effect watches for when an edit session starts
useEffect(() => {
    // Make sure we actually have an active comment ID and the ref is ready
    if (updateCommentId && editCommentRef.current) {
        editCommentRef.current.focus();
    }
}, [updateCommentId]);

    const handleCancel = () => {
        setUpdateCommentId()
    }

    const handleComment = async () => {
        try {
            setLoading(true)
            const createComment = await api.post(`/post/${postId}/createComment`, { content: commentText })

        } catch (e) {
            console.log(e)
        } finally {
            setCommentText('')
            setRefresh(prev => !prev)
            setLoading(false)
        }
    }

    return (

        <div>

            <div>
                <input className="border rounded-md" type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleComment()
                    }
                }} placeholder='Type your comment here'  />
                {
                    loading ? 'Posting Comment...' : commentText ? <button className="bg-emerald-300 rounded-md cursor-pointer" onClick={handleComment}>Post your Comment</button> : ''
                }

            </div>
            <div>
                <h4>Comments</h4>

                {
                    comments.length === 0 ?
                        "be first to comment"
                        : comments.map((comment) => (
                            <div key={comment._id} className="flex justify-between">
                                <div>
                                    <b>{comment.user?.username}:</b> {comment.text}
                                </div>

                                <div className="gap-2.5">
                                    {
                                        comment.user?.username === username ?
                                            <div className="flex gap-1">
                                                <button className="bg-red-400 rounded-md cursor-pointer hover:scale-125 transition-transform" onClick={() => { handleDeleteComment(comment._id) }}>
                                                    delete
                                                </button>
                                                {
                                                    updateCommentId === comment._id && <div className="flex gap-1">
                                                        <input type="text" value={updateText} onChange={(e) => setUpdateText(e.target.value)} onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdateComment(comment._id)
                                                            }
                                                            if (e.key === 'Escape') {
                                                                handleCancel()
                                                            }
                                                        }} ref={editCommentRef} />
                                                        <button className="bg-blue-400 rounded-md cursor-pointer hover:scale-125 transition-transform" onClick={() => { handleUpdateComment(comment._id) }}>save</button>
                                                        <button className='bg-gray-400 rounded-md cursor-pointer hover:scale-125 transition-transform' onClick={() => { handleCancel() }}>Cancel</button>
                                                    </div>
                                                }

                                                {
                                                    updateCommentId != comment._id && <button className="bg-green-400 rounded-md cursor-pointer hover:scale-125 transition-transform" onClick={() => { handleEdit(comment._id, comment.text) }}>
                                                    Edit
                                                </button>
                                                }
                                                
                                            </div>
                                            : ''
                                    }

                                </div>
                            </div>
                        ))
                }

            </div>

        </div>



    )
}

export default Comments
