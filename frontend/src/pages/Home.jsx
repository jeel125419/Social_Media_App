import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Post from '../components/Post'

function Home() {
    const [posts, setPosts] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [sortBy, setSortBy] = useState('Newest')

    const fetchPosts = async () => {
        try {
            const res = await api.get('/post')

            setPosts(res.data.post)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchPosts()

        // const interval = setInterval(() => {
        //     fetchPosts()
        // }, 5000);

        // return () => clearInterval(interval)

    }, [refresh])

    useEffect(() => {
        if (sortBy === 'Newest') {
            const sortedPosts = [...posts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            setPosts(sortedPosts)
        }
        if (sortBy === 'Oldest') {
            const sortedPosts = [...posts].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
            setPosts(sortedPosts)
        }
    }, [sortBy])

    return (
        <div className='container mx-auto py-20 bg-[#F8FAFC] h-screen'>
            <TopBar sortBy={sortBy} setSortBy={setSortBy} setPosts={setPosts} refresh={refresh} setRefresh={setRefresh} fetchPosts={fetchPosts} posts={posts} />

            {/* <div className='m-3 p-3 border rounded-md'>
                Total posts: {posts.length}
            </div> */}

            <Post posts={posts} setPosts={setPosts} setRefresh={setRefresh} />

        </div>
        
    )
}

export default Home
