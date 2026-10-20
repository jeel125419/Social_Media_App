import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import { useParams } from 'react-router-dom'

function Comments() {
    const { postId } = useParams()

    const [updateText, setUpdateText] = useState('')
    const [updateCommentId, setUpdateCommentId] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [openMenu, setOpenMenu] = useState(null)

    const editCommentRef = useRef(null)
    const menuRef = useRef(null)
    const username = localStorage.getItem('username')

    // Fetch comments
    useEffect(() => {
        let cancelled = false

        const fetchComments = async () => {
            setFetching(true)

            try {
                const response = await api.get(`/post/${postId}/comments`)

                if (!cancelled) {
                    setComments(response.data.comments || [])
                }
            } catch (e) {
                console.error('Failed to fetch comments:', e)
            } finally {
                if (!cancelled) {
                    setFetching(false)
                }
            }
        }

        fetchComments()

        return () => {
            cancelled = true
        }
    }, [postId, refresh])

    // Close the three-dot menu when clicking or tapping outside it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpenMenu(null)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('touchstart', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            document.removeEventListener('touchstart', handleOutsideClick)
        }
    }, [])

    // Focus the edit input when editing starts
    useEffect(() => {
        if (updateCommentId && editCommentRef.current) {
            editCommentRef.current.focus()
        }
    }, [updateCommentId])

    const handleComment = async () => {
        const content = commentText.trim()

        if (!content || loading) return

        try {
            setLoading(true)

            await api.post(`/post/${postId}/createComment`, {
                content,
            })

            setCommentText('')
            setRefresh(prev => !prev)
        } catch (e) {
            console.error('Failed to create comment:', e)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this comment?'
        )

        if (!confirmed) return

        try {
            await api.delete(`/post/${postId}/${commentId}`)

            setOpenMenu(null)
            setRefresh(prev => !prev)
        } catch (e) {
            console.error('Failed to delete comment:', e)
            window.alert('Could not delete the comment. Please try again.')
        }
    }

    const handleEdit = (commentId, text) => {
        setUpdateCommentId(commentId)
        setUpdateText(text || '')
        setOpenMenu(null)
    }

    const handleUpdateComment = async (commentId) => {
        const content = updateText.trim()

        if (!content) return

        try {
            await api.put(`/post/${postId}/${commentId}`, {
                content,
            })

            setUpdateCommentId(null)
            setUpdateText('')
            setRefresh(prev => !prev)
        } catch (e) {
            console.error('Failed to update comment:', e)
            window.alert('Could not update the comment. Please try again.')
        }
    }

    const handleCancel = () => {
        setUpdateCommentId(null)
        setUpdateText('')
    }

    const handleOpenMenu = (commentId) => {
        setOpenMenu(current =>
            current === commentId ? null : commentId
        )
    }

    const isCommentValid = commentText.trim().length > 0

    return (
        <section className="w-full min-w-0">

            {/* Add a comment */}
            <form
                className="mx-auto flex w-full max-w-xl min-w-0 flex-col gap-2"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleComment()
                }}
            >
                <input
                    className="h-10 w-full min-w-0 rounded-md border border-[#E2E8F0] bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
                    type="text"
                    value={commentText}
                    maxLength={1000}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Write a comment..."
                    aria-label="Write a comment"
                />

                <button
                    type="submit"
                    disabled={!isCommentValid || loading}
                    className="min-h-10 w-full rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                    {loading ? 'Posting...' : 'Post comment'}
                </button>
            </form>

            {/* Comment count */}
            <div className="mx-auto mt-5 w-full max-w-xl min-w-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-800">
                        All comments
                    </h3>

                    <span className="text-xs text-slate-500">
                        {comments.length}
                    </span>
                </div>

                {fetching ? (
                    <div className="flex justify-center py-6">
                        <div
                            className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600"
                            role="status"
                            aria-label="Loading comments"
                        />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-7 text-center">
                        <p className="text-sm text-slate-600">
                            No comments yet.
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Start the conversation.
                        </p>
                    </div>
                ) : (
                    <div className="flex w-full min-w-0 flex-col">
                        {comments.map((comment) => {
                            const commentUsername =
                                comment.user?.username || 'Unknown user'

                            const isOwner =
                                commentUsername === username

                            const isEditing =
                                updateCommentId === comment._id

                            return (
                                <article
                                    key={comment._id}
                                    className="flex w-full min-w-0 items-start gap-3 border-b border-slate-100 py-3 last:border-b-0"
                                >
                                    {/* Avatar */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5E7EB] text-sm font-semibold text-slate-700">
                                        {commentUsername[0].toUpperCase()}
                                    </div>

                                    {/* Comment content */}
                                    <div className="min-w-0 flex-1">
                                        <p className="break-words text-xs font-semibold text-slate-700">
                                            {commentUsername}
                                        </p>

                                        {isEditing ? (
                                            <div className="mt-2 flex min-w-0 flex-col gap-2">
                                                <input
                                                    ref={editCommentRef}
                                                    className="w-full min-w-0 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none"
                                                    value={updateText}
                                                    maxLength={1000}
                                                    onChange={(event) =>
                                                        setUpdateText(event.target.value)
                                                    }
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter') {
                                                            handleUpdateComment(comment._id)
                                                        }

                                                        if (event.key === 'Escape') {
                                                            handleCancel()
                                                        }
                                                    }}
                                                    aria-label="Edit comment"
                                                />

                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={!updateText.trim()}
                                                        onClick={() =>
                                                            handleUpdateComment(comment._id)
                                                        }
                                                        className="rounded-md bg-blue-400 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={handleCancel}
                                                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                                {comment.text}
                                            </p>
                                        )}
                                    </div>

                                    {/* Comment options */}
                                    {isOwner && !isEditing && (
                                        <div
                                            ref={openMenu === comment._id ? menuRef : null}
                                            className="relative shrink-0"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenMenu(comment._id)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                                aria-label="Comment options"
                                                aria-expanded={openMenu === comment._id}
                                            >
                                                &#8942;
                                            </button>

                                            {openMenu === comment._id && (
                                                <div className="absolute right-0 top-9 z-30 w-28 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                                                    <button
                                                        type="button"
                                                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                        onClick={() =>
                                                            handleEdit(
                                                                comment._id,
                                                                comment.text
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                        onClick={() =>
                                                            handleDeleteComment(comment._id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Comments