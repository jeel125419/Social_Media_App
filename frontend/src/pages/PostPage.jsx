import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from '../api/axios'
import Comments from "../components/Comments"
import Likes from "../components/Likes"

function PostPage() {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postContent = await api.get(`/post/${postId}`)

                setPost(postContent.data.post)

            } catch (e) {
                console.log(e)
            }
        }
        fetchPost()
    }, [postId, refresh])

    if (!post) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div>
                <h3><b>User:</b>{post.user?.username}</h3>
                <p><b>Post:</b>{post.text}</p>
            </div>
            
            <Likes />

           <Comments />

        </div>
    )
}

export default PostPage
