import { useState, useEffect } from 'react'
import api from '../api/axios'
import TopBar from '../components/TopBar'
import Post from '../components/Post'

function Home() {
    const [posts, setPosts] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [sortBy, setSortBy] = useState('Newest')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchPosts = async () => {
        setIsLoading(true)
        setError(false)

        try {
            const res = await api.get('/post')
            setPosts(res.data.post || [])
        } catch (e) {
            console.error('Failed to fetch posts:', e)
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [refresh])

    useEffect(() => {
        setPosts(currentPosts => {
            const sortedPosts = [...currentPosts]

            if (sortBy === 'Newest') {
                return sortedPosts.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                )
            }

            return sortedPosts.sort(
                (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
            )
        })
    }, [sortBy])

    return (
        <div className="w-full min-w-0 min-h-screen bg-[#F8FAFC]">
            <div className="container mx-auto px-3 sm:px-4 pt-20 pb-6 sm:pt-24 sm:pb-10">
                <TopBar
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setPosts={setPosts}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    fetchPosts={fetchPosts}
                    posts={posts}
                />

                {isLoading ? (
                    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4">
                        <div
                            className="h-10 w-10 animate-spin rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB]"
                            role="status"
                            aria-label="Loading posts"
                        />
                        <p className="text-sm text-[#64748B]">
                            Loading posts...
                        </p>
                    </div>
                ) : error ? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
                        <p className="text-[#475569]">
                            We couldn't load the posts.
                        </p>
                        <button
                            onClick={fetchPosts}
                            className="rounded-lg bg-[#2563EB] px-4 py-2 text-white hover:bg-[#1D4ED8]"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <Post
                        posts={posts}
                        setPosts={setPosts}
                        setRefresh={setRefresh}
                    />
                )}
            </div>
        </div>
    )
}

export default Home
