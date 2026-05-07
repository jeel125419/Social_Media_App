import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from '../api/axios'

function PostPage() {
    const {postId} = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            try{
                const postContent = await api.get(`/post/${postId}`)
                const comments = await api.get(`/post/${postId}/comments`)

                setPost(postContent.data.post)
                setComments(comments.data.comments)

            } catch(e) {
                console.log(e)
            }
        }
        fetchPost()
    }, [postId, refresh])

    if (!post) {
        return <div>Loading...</div>
    }

    const handleComment = async () => {
        try{
            const createComment = await api.post(`/post/${postId}/createComment`, {content: commentText})

        } catch(e){
            console.log(e)
        } finally{
            setCommentText('')
            setRefresh(prev => !prev)
        }
    }

  return (
    <div>
        <div>
            <h3><b>User:</b>{post.user?.username}</h3>
            <p><b>Post:</b>{post.text}</p>
         </div>
         <div>
            <input type="text" value={commentText} onChange={(e)=> setCommentText(e.target.value)} onKeyDown={(e) => {
                if(e.key === 'Enter'){
                    handleComment()
                }
            }}/> 
            <button onClick={handleComment}>Post your Comment</button>
         </div>
         <div>
            <h4>Comments</h4>
            {comments.map((comment) => (
                <div key={comment._id}>
                    <p><b>{comment.user?.username}:</b> {comment.text}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default PostPage
