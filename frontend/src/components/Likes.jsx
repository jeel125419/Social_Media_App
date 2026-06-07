import { useState, useEffect } from 'react'
import api from '../api/axios';
import { useParams } from 'react-router-dom';

function Likes() {

    const { postId } = useParams()
    const [refresh, setRefresh] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/post/${postId}/likes`)
                console.log("BACKEND GET RESPONSE:", response.data)

                setIsLiked(response.data.isLikedByMe)
                setLikesCount(response.data.totalLikes)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [postId])

    const handleLikes = async () => {
        try {
            const response = await api.post(`/post/${postId}/like`)
            setIsLiked(response.data.isLikedByMe)
            setLikesCount(response.data.totalLikes)
        } catch (e) {
            console.log(e);
        } 
    }

    const currentUsername = localStorage.getItem('username') 

    // console.log(likesCount, isLiked)

    if (loading) {
        return (
            <div className="animate-pulse bg-gray-300 h-9 w-20 rounded-md"></div>
        )
    }

    return (
        <div>
            <button className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors hover:scale-125 ${
                    isLiked 
                        ? "bg-pink-500 text-white" 
                        : "bg-gray-200 text-gray-800"
                }`} onClick={handleLikes}>Like: {likesCount}</button>
        </div>
    )
}

export default Likes
