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
    const [openMenu, setOpenMenu] = useState(null)

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
            if (confirm) {
                await api.delete(`/post/${postId}/${commentId}`)
                setOpenMenu(null)
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

    const handleOpenMenu = (id) => {
        setOpenMenu(openMenu === id ? null : id)
    }

    const btnColor = commentText.trim() === '' ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-400 cursor-pointer'

    return (

        <div>

            <div className="gap-3 flex flex-col items-center justify-center">
                <div>
                    <input className="border rounded-md w-100 h-10 p-3 border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-blue-500" type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleComment()
                        }
                    }} placeholder='Type your comment here' />
                </div>
                <div>
                    {
                        loading ? 'Posting Comment...' :
                            <button className={` ${btnColor} rounded-md text-white w-100 h-10 p-3 flex items-center justify-center`} onClick={handleComment} disabled={commentText.trim() === ''}>
                                Post your Comment
                            </button>
                    }
                </div>


            </div>
            <div>
                <h4>Comments</h4>
                <h5>{comments.length} Total comments</h5>
                <div className='flex flex-col gap-2'>

                    {
                        comments.length === 0 ?
                            "be first to comment"
                            : comments.map((comment) => (
                                <div key={comment._id} className='h-20 w-100 border bg-white border-[#E2E8F0] rounded-md shadow-xl m-2 flex justify-between'>
                                    <div className='flex gap-2 m-3'>
                                        <div className='h-12 w-12 rounded-full flex justify-center items-center font-bold bg-[#D9D9D9]'>
                                            {comment.user?.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className='text-sm text-gray-600'>
                                                {comment.user?.username}
                                            </div>
                                            <div>
                                                {comment.text}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='m-3'>
                                        <button className='cursor-pointer' onClick={() => { handleOpenMenu(comment._id) }}>
                                            &#8942;
                                        </button>
                                        <div className='relative'>
                                            {
                                                comment._id === openMenu && <div className='absolute top-0 right-0 z-10 h-20 w-20 border rounded-md'>
                                                    <button className='p-2 w-full cursor-pointer'>
                                                        Edit
                                                    </button>
                                                    <button className='p-2 w-full cursor-pointer' onClick={() => { handleDeleteComment(comment._id) }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                // <div key={comment._id} className="flex justify-between">
                                //     <div>
                                //         <b>{comment.user?.username}:</b> {comment.text}
                                //     </div>

                                //     <div className="gap-2.5">
                                //         {
                                //             comment.user?.username === username ?
                                //                 <div className="flex gap-1">
                                //                     <button className="bg-red-400 rounded-md cursor-pointer hover:scale-125 transition-transform" onClick={() => { handleDeleteComment(comment._id) }}>
                                //                         delete
                                //                     </button>
                                //                     {
                                //                         updateCommentId === comment._id && <div className="flex gap-1">
                                //                             <input type="text" value={updateText} onChange={(e) => setUpdateText(e.target.value)} onKeyDown={(e) => {
                                //                                 if (e.key === 'Enter') {
                                //                                     handleUpdateComment(comment._id)
                                //                                 }
                                //                                 if (e.key === 'Escape') {
                                //                                     handleCancel()
                                //                                 }
                                //                             }} ref={editCommentRef} />
                                //                             <button className="bg-blue-400 rounded-md cursor-pointer hover:scale-125 transition-transform" onClick={() => { handleUpdateComment(comment._id) }}>save</button>
                                //                             <button className='bg-gray-400 rounded-md cursor-pointer hover:scale-125 transition-transform' onClick={() => { handleCancel() }}>Cancel</button>
                                //                         </div>
                                //                     }

                                //                     {
                                //                         updateCommentId != comment._id && <button className="bg-green-400 rounded-md cursor-pointer hover:scale-125 transition-transform" onClick={() => { handleEdit(comment._id, comment.text) }}>
                                //                             Edit
                                //                         </button>
                                //                     }

                                //                 </div>
                                //                 : ''
                                //         }

                                //     </div>
                                // </div>
                            ))
                    }
                </div>


            </div>

        </div>



    )
}

export default Comments
