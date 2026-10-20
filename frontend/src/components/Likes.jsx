
import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useParams } from 'react-router-dom'

function Likes() {
    const { postId } = useParams()

    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        let cancelled = false

        const fetchLikes = async () => {
            setLoading(true)

            try {
                const response = await api.get(`/post/${postId}/likes`)

                if (!cancelled) {
                    setIsLiked(response.data.isLikedByMe)
                    setLikesCount(response.data.totalLikes)
                }
            } catch (e) {
                console.error('Failed to fetch likes:', e)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchLikes()

        return () => {
            cancelled = true
        }
    }, [postId])

    const handleLikes = async () => {
        if (updating) return

        try {
            setUpdating(true)

            const response = await api.post(`/post/${postId}/like`)
            setIsLiked(response.data.isLikedByMe)
            setLikesCount(response.data.totalLikes)
        } catch (e) {
            console.error('Failed to update like:', e)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-9 w-full justify-center sm:justify-start">
                <div
                    className="h-9 w-20 animate-pulse rounded-md bg-gray-200"
                    role="status"
                    aria-label="Loading likes"
                />
            </div>
        )
    }

    return (
        <div className="flex w-full min-w-0 items-center">
            <button
                type="button"
                onClick={handleLikes}
                disabled={updating}
                aria-pressed={isLiked}
                className={`max-w-full cursor-pointer rounded-md px-3 py-2 transition-colors disabled:cursor-wait ${
                    isLiked
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
                {updating ? 'Updating...' : `Like: ${likesCount}`}
            </button>
        </div>
    )
}

export default Likes
