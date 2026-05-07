import {useState, useEffect} from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

function Home() {
    const [posts, setPosts] = useState([])
    const [text, setText] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [like, setLike] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            try{
                const res = await api.get('/post')
                
                setPosts(res.data.post)
            } catch(e) {
                console.log(e)
            }
        }
        fetchPosts()
        
    }, [refresh])


    const handleCreatePost = async () => {

        try{

            const res = await api.post('/createPost', {content: text})
            console.log(res.data)

        } catch(e) {
            console.log(e)
        } finally{
            setText('')
            setRefresh(!refresh)
        }

    }

  return (
    <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
            if (e.key === "Enter"){
                e.preventDefault()
                handleCreatePost()
            }
        }}/>
        <button onClick={handleCreatePost}>Create post</button>

      {posts.map(post => (
        <div key={post._id}  className='border m-3 p-3 rounded-md'>
            <h3><b>User:</b>{post.user?.username}</h3>
            <p><b>Post:</b>{post.text}</p>
            <Link to={`/post/${post._id}`}>View post</Link>
        </div>
      ))}
    </div>
  )
}

export default Home
