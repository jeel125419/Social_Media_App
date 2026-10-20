
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import Comments from "../components/Comments"

function PostPage() {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLiking, setIsLiking] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancelled = false

        const fetchPost = async () => {
            setIsLoading(true)
            setError(false)

            try {
                const [postResponse, likesResponse] = await Promise.all([
                    api.get(`/post/${postId}`),
                    api.get(`/post/${postId}/likes`)
                ])

                if (!cancelled) {
                    setPost(postResponse.data.post)
                    setIsLiked(likesResponse.data.isLikedByMe)
                    setLikesCount(likesResponse.data.totalLikes)
                }
            } catch (e) {
                console.error("Failed to fetch post:", e)
                if (!cancelled) setError(true)
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        fetchPost()

        return () => {
            cancelled = true
        }
    }, [postId])

    const updatedTime = (time) => {
        if (!time) return 0

        return Math.max(
            0,
            (Date.now() - new Date(time).getTime()) / 1000
        )
    }

    const formatTime = (time) => {
        const diff = updatedTime(time)

        if (diff < 60) return `${Math.floor(diff)} seconds ago`
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
        if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`

        return new Date(time).toLocaleDateString()
    }

    const handleLikes = async () => {
        if (isLiking) return

        try {
            setIsLiking(true)

            const response = await api.post(`/post/${postId}/like`)

            setIsLiked(response.data.isLikedByMe)
            setLikesCount(response.data.totalLikes)
        } catch (e) {
            console.error("Failed to update like:", e)
        } finally {
            setIsLiking(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center gap-3 px-4 pt-20 sm:min-h-[calc(100vh-6rem)] sm:pt-24">
                <div
                    className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"
                    role="status"
                    aria-label="Loading post"
                />
                <p className="text-sm text-slate-500">
                    Loading post...
                </p>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center gap-3 px-4 pt-20 text-center sm:min-h-[calc(100vh-6rem)] sm:pt-24">
                <p className="text-slate-600">
                    {error ? "Couldn't load this post." : "Post not found."}
                </p>

                {error && (
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Try again
                    </button>
                )}
            </div>
        )
    }

    const username = post.user?.username || "Unknown user"

    return (
        <main className="min-h-screen w-full min-w-0 bg-[#F8FAFC] px-3 pb-8 pt-20 sm:px-4 sm:pt-24">
            <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-3 sm:gap-4">

                {/* Post */}
                <article className="w-full min-w-0 rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                    <div className="p-4 sm:p-5">

                        {/* Author */}
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] text-base font-semibold text-slate-800">
                                {username[0].toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <h2 className="break-words text-sm font-semibold text-slate-900">
                                    {username}
                                </h2>

                                <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-slate-500">
                                    <span>
                                        Posted {formatTime(post.createdAt)}
                                    </span>

                                    {post.updatedAt &&
                                        post.createdAt &&
                                        new Date(post.updatedAt).getTime() !==
                                        new Date(post.createdAt).getTime() && (
                                            <span>
                                                · Edited {formatTime(post.updatedAt)}
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* Post text */}
                        <div className="mt-4 min-w-0">
                            <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-800">
                                {post.text}
                            </p>
                        </div>

                        {/* Like action */}
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                            <button
                                type="button"
                                onClick={handleLikes}
                                disabled={isLiking}
                                aria-label={isLiked ? "Unlike post" : "Like post"}
                                aria-pressed={isLiked}
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60 ${
                                    isLiked ? "text-rose-600" : "text-slate-500"
                                }`}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6"
                                    fill={isLiked ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                                </svg>
                            </button>

                            <span className="text-sm text-slate-600">
                                {likesCount} {likesCount === 1 ? "like" : "likes"}
                            </span>
                        </div>
                    </div>
                </article>

                {/* Comments */}
                <section className="w-full min-w-0 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Comments
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Join the conversation.
                        </p>
                    </div>

                    <div className="mx-auto w-full max-w-xl min-w-0">
                        <Comments />
                    </div>
                </section>

            </div>
        </main>
    )
}

export default PostPage
