import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from '../api/axios'
import Comments from "../components/Comments"
import Likes from "../components/Likes"

function PostPage() {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postContent = await api.get(`/post/${postId}`)
                const likesResponse = await api.get(`/post/${postId}/likes`)

                setPost(postContent.data.post)
                setIsLiked(likesResponse.data.isLikedByMe)
                setLikesCount(likesResponse.data.totalLikes)

            } catch (e) {
                console.log(e)
            }
        }
        fetchPost()
    }, [postId, refresh])

    const updatedTime = (time) => {
        const current = new Date()
        const updated = new Date(time)
        const diff = (current - updated) / 1000
        return diff
    }

    const handleLikes = async () => {
        try {
            const response = await api.post(`/post/${postId}/like`)
            setIsLiked(response.data.isLikedByMe)
            setLikesCount(response.data.totalLikes)
        } catch (e) {
            console.log(e);
        } 
    }

    if (!post) {
        return <div>Loading...</div>
    }

    return (
        <div className="bg-[#F8FAFC] h-screen">
            <div className="pt-20 items-center justify-center flex flex-col">
                {/* <div>
                    <h3><b>User:</b>{post.user?.username}</h3>
                    <p><b>Post:</b>{post.text}</p>
                </div> */}
                <div className="w-300 h-80 border my-10 border-[#E2E8F0] rounded-lg bg-white flex flex-col justify-center items-center shadow-xl">
                    <div className="flex gap-3 items-center p-4">
                        <div className="h-18 w-18 rounded-full bg-[#D9D9D9] flex items-center justify-center">
                            <h1 className="text-4xl font-bold">
                                {post.user?.username[0].toUpperCase()}
                            </h1>
                        </div>
                        <div>
                            <div>
                                <h3>
                                    {post.user?.username}
                                </h3>
                            </div>
                            <div>
                                <div className="flex gap-2 items-center text-sm text-gray-500">
                                    Posted {updatedTime(post.createdAt) < 60 ? `${Math.floor(updatedTime(post.createdAt))} seconds ago` :
                                        updatedTime(post.createdAt) < 3600 ? `${Math.floor(updatedTime(post.createdAt) / 60)} minutes ago` :
                                            updatedTime(post.createdAt) < 86400 ? `${Math.floor(updatedTime(post.createdAt) / 3600)} hours ago` :
                                                `${Math.floor(updatedTime(post.createdAt) / 86400)} days ago `}{
                                        post.updatedAt !== post.createdAt &&
                                        <div>
                                            • Edited {updatedTime(post.updatedAt) < 60 ? `${Math.floor(updatedTime(post.updatedAt))} seconds ago` :
                                                updatedTime(post.updatedAt) < 3600 ? `${Math.floor(updatedTime(post.updatedAt) / 60)} minutes ago` :
                                                    updatedTime(post.updatedAt) < 86400 ? `${Math.floor(updatedTime(post.updatedAt) / 3600)} hours ago` :
                                                        `${Math.floor(updatedTime(post.updatedAt) / 86400)} days ago`}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className="text-2xl font-medium">
                                {post.text}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4 items-center">
                            <div className="text-2xl cursor-pointer transition-colors duration-2000" onClick={handleLikes}>
                                {isLiked ? <span className="text-pink-500">❤️</span> : <span className="text-gray-400">🤍</span>}
                                {/* ♡ */}
                            </div>
                            <div>
                                {likesCount} Likes
                            </div>
                        </div>
                    </div>
                </div>

                {/* <Likes /> */}

                <Comments />
            </div>

        </div>
    )
}

export default PostPage
