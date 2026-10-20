
import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

function Post({ posts, setPosts, setRefresh }) {
    const [editPostId, setEditPostId] = useState(null)
    const [editText, setEditText] = useState('')
    const [openMenu, setOpenMenu] = useState(null)
    const [saving, setSaving] = useState(false)

    const editRef = useRef(null)
    const menuRef = useRef(null)

    const username = localStorage.getItem('username')

    // Close the menu when clicking or tapping outside it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpenMenu(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [])

    // Focus the edit field when editing starts
    useEffect(() => {
        if (editPostId && editRef.current) {
            editRef.current.focus()
        }
    }, [editPostId])

    const handleDeletePost = async (postId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this post?'
        )

        if (!confirmed) return

        try {
            await api.delete(`/post/${postId}`)
            setOpenMenu(null)
            setRefresh(prev => !prev)
        } catch (e) {
            console.error('Failed to delete post:', e)
            window.alert('Could not delete the post. Please try again.')
        }
    }

    const handleEditPost = (postId, text) => {
        setEditPostId(postId)
        setEditText(text || '')
        setOpenMenu(null)
    }

    const handleEditSave = async (postId) => {
        const content = editText.trim()

        if (!content || saving) return

        try {
            setSaving(true)

            await api.put(`/post/${postId}`, { content })

            setEditPostId(null)
            setEditText('')
            setRefresh(prev => !prev)
        } catch (e) {
            console.error('Failed to update post:', e)
            window.alert('Could not save your changes. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setEditPostId(null)
        setEditText('')
    }

    const formatTime = (time) => {
        if (!time) return ''

        const diff = Math.max(
            0,
            (Date.now() - new Date(time).getTime()) / 1000
        )

        if (diff < 60) return `${Math.floor(diff)}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`

        return new Date(time).toLocaleDateString()
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="mx-auto my-8 flex w-full max-w-2xl flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
                    ✨
                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                    No posts yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Be the first to share something with the community.
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-4 sm:gap-5">
            {posts.map(post => {
                const postUsername = post.user?.username || 'Unknown user'
                const isEditing = editPostId === post._id
                const isOwner = username === postUsername

                return (
                    <article
                        key={post._id}
                        className="group relative w-full min-w-0 overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-lg"
                    >
                        <div className="flex min-w-0 items-start gap-3 p-4 sm:gap-4 sm:p-5">
                            <Link
                                to={`/post/${post._id}`}
                                aria-label={`Open post by ${postUsername}`}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-base font-bold text-blue-700 ring-2 ring-white sm:h-12 sm:w-12"
                            >
                                {postUsername[0].toUpperCase()}
                            </Link>

                            <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-start justify-between gap-2">
                                    <Link
                                        to={`/post/${post._id}`}
                                        className="min-w-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <h3 className="break-words font-semibold text-slate-900 transition-colors hover:text-blue-600">
                                            {postUsername}
                                        </h3>

                                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 sm:text-sm">
                                            <span>{formatTime(post.createdAt)}</span>

                                            {post.updatedAt &&
                                                post.createdAt &&
                                                new Date(post.updatedAt).getTime() !==
                                                new Date(post.createdAt).getTime() && (
                                                    <span className="text-slate-400">
                                                        · Edited {formatTime(post.updatedAt)}
                                                    </span>
                                                )}
                                        </div>
                                    </Link>

                                    {isOwner && (
                                        <div
                                            ref={menuRef}
                                            className="relative shrink-0"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenMenu(current =>
                                                        current === post._id
                                                            ? null
                                                            : post._id
                                                    )
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                aria-label="Post options"
                                                aria-expanded={openMenu === post._id}
                                            >
                                                &#8942;
                                            </button>

                                            {openMenu === post._id && (
                                                <div className="absolute right-0 top-10 z-30 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                                                    <button
                                                        type="button"
                                                        className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-blue-50"
                                                        onClick={() =>
                                                            handleEditPost(
                                                                post._id,
                                                                post.text
                                                            )
                                                        }
                                                    >
                                                        Edit post
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                                        onClick={() =>
                                                            handleDeletePost(post._id)
                                                        }
                                                    >
                                                        Delete post
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="mt-4">
                                        <textarea
                                            ref={editRef}
                                            className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                            value={editText}
                                            maxLength={1000}
                                            onChange={e =>
                                                setEditText(e.target.value)
                                            }
                                            onKeyDown={e => {
                                                if (e.key === 'Escape') {
                                                    handleCancel()
                                                }
                                            }}
                                        />

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={!editText.trim() || saving}
                                                onClick={() =>
                                                    handleEditSave(post._id)
                                                }
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {saving
                                                    ? 'Saving...'
                                                    : 'Save changes'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/post/${post._id}`}
                                        className="mt-4 block min-w-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 sm:text-base">
                                            {post.text}
                                        </p>

                                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 opacity-100 transition-colors group-hover:text-blue-700 sm:opacity-0 sm:group-hover:opacity-100">
                                            View post
                                            <span aria-hidden="true">→</span>
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}

export default Post
