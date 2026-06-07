import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

function Home() {
    const [posts, setPosts] = useState([])
    const [text, setText] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [like, setLike] = useState('')
    const [editPostId, setEditPostId] = useState()
    const [editText, setEditText] = useState('')
    const [loading, setLoading] = useState(false)
    const editRef = useRef()
    const [searchText, setSearchText] = useState('')
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


    const handleCreatePost = async () => {

        try {

            setLoading(true)

            const res = await api.post('/createPost', { content: text })
            console.log(res.data)

        } catch (e) {
            console.log(e)
        } finally {
            setText('')
            setRefresh(!refresh)
            setLoading(false)
        }

    }
    const username = localStorage.getItem('username')

    const handleDeleteComment = async (postId) => {
        try {
            let confirm = window.confirm("are you sure you want to delete")
            if (confirm) {
                await api.delete(`/post/${postId}`)
            }
        } catch (e) {
            console.log(e);
        } finally {
            setRefresh(prev => !prev)
        }
    }


    const handleEditPost = (postId, text) => {
        setEditPostId(postId)
        setEditText(text)
        setTimeout(() => {
            editRef.current.focus()
        }, 0);
    }

    const handleEditSave = async (postId) => {
        try {
            await api.put(`/post/${postId}`, { content: editText })
        } catch (e) {
            console.log(e);
        } finally {
            setEditPostId()
            setRefresh(prev => !prev)
        }
    }

    const handleCancel = () => {
        setEditPostId()
    }

    const handleSearch = () => {
        // const searchPost = prompt("Enter post text to search")
        if (searchText) {
            const filteredPosts = [...posts].filter(post => post.text.toLowerCase().includes(searchText.toLowerCase()))
            setPosts(filteredPosts)
        } else {
            fetchPosts()
        }
    }
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
        <div>
            <div className='flex justify-between items-center m-3 p-3 border rounded-md'>
                <div className='flex gap-2'>
                    <input type="text" className='border rounded-md' value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleCreatePost()
                        }
                    }} placeholder='Type post text' maxLength={100} />
                     <div className='text-sm text-gray-500'>{text.length}/100</div>
                    {
                        loading ? 'Posting the Post...' :
                            text ? <button className="bg-emerald-600/50 rounded-md cursor-pointer" onClick={handleCreatePost}>Create post</button> : ''

                    }
                </div>
                <div>
                    <input type='text' placeholder='Search posts...' className='border rounded-md' value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch()
                        }
                    }} />
                </div>
                <div>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
                </div>
            </div>

            <div className='m-3 p-3 border rounded-md'>
                Total posts: {posts.length}
            </div>

            {
                posts.length === 0 ? <div>Post loading...</div> : posts.map(post => (
                    <div key={post._id} className='border m-3 p-3 rounded-md flex justify-between'>
                        <div>
                            <div className='flex gap-3 items-center mb-2'>

                                {
                                    post.updatedAt !== post.createdAt &&
                                    <div className='text-sm text-gray-500 italic'>
                                        Edited
                                    </div>
                                }
                                {
                                    post.user?.username === username &&
                                    <div className='text-sm text-gray-500 italic'>
                                        Your Post
                                    </div>
                                }
                            </div>
                            <div className='flex gap-3 items-center'>
                                <div>
                                    <div className='w-10 h-10 bg-gray-300 items-center justify-center flex rounded-full font-bold text-lg'>
                                        {post.user?.username[0].toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h3><b>User:</b>{post.user?.username}</h3>
                                    <p><b>Post:</b>{post.text}</p>
                                </div>
                            </div>

                            <Link to={`/post/${post._id}`}>View post</Link>
                            <div className='flex gap-3 text-sm text-gray-500 mt-2'>
                                <div>Created at: {new Date(post.createdAt).toLocaleString()}</div>
                                <div>Updated at: {new Date(post.updatedAt).toLocaleString()}</div>
                            </div>
                        </div>
                        {
                            post.user?.username === username &&
                            <div className='flex'>
                                <button onClick={() => { handleDeleteComment(post._id) }} className='bg-red-700 rounded-md m-2 p-2 cursor-pointer'>Delete Post</button>
                                {
                                    editPostId === post._id &&
                                    <div>
                                        <input className='border rounded-md ' type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleEditSave(post._id)
                                            }
                                        }} ref={editRef} />
                                        <button className='bg-blue-400 rounded-md m-2 p-2 cursor-pointer' onClick={() => { handleEditSave(post._id) }}>Save</button>
                                        <button className='bg-gray-400 rounded-md m-2 p-2 cursor-pointer' onClick={() => { handleCancel() }}>Cancel</button>
                                    </div>
                                }
                                {
                                    editPostId !== post._id &&
                                    <button className='bg-green-400 rounded-md m-2 p-2 cursor-pointer' onClick={() => { handleEditPost(post._id, post.text) }}>Edit Post</button>
                                }
                            </div>
                        }

                    </div>
                ))
            }

            { }
        </div>
    )
}

export default Home
