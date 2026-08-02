import { useState } from 'react'
import api from '../api/axios'

function TopBar({ sortBy, setSortBy, setPosts, refresh, setRefresh, fetchPosts, posts }) {
    const [text, setText] = useState('')
    const [searchText, setSearchText] = useState('')
    const [loading, setLoading] = useState(false)

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

    const handleSearch = () => {
        if (searchText) {
            const filteredPosts = [...posts].filter(post => post.text.toLowerCase().includes(searchText.toLowerCase()))
            setPosts(filteredPosts)
        } else {
            fetchPosts()
        }
    }



    return (
        <div>
            <div className='flex justify-between items-center m-3 p-3 border border-[#E2E8F0] rounded-md'>
                <div className='flex gap-2'>
                    <input type="text" className='rounded-md p-1 bg-[#ededed] focus:outline-none focus:ring-1 focus:bg-white focus:ring-blue-500' value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleCreatePost()
                        }
                    }} placeholder='Type post text' maxLength={100} />
                    <div className='text-sm text-gray-500'>{text.length}/100</div>
                    {
                        loading ? 'Posting the Post...' :
                            text ? <button className="bg-blue-400 p-1 hover:scale-95 transition-transform duration-200 rounded-2xl cursor-pointer" onClick={handleCreatePost}>Create post</button> : ''

                    }
                </div>
                <div>
                    <input type='text' placeholder='Search posts...' className='rounded-md p-1 bg-[#ededed] focus:outline-none focus:ring-1 focus:bg-white focus:ring-blue-500' value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => {
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
        </div>
    )
}

export default TopBar
