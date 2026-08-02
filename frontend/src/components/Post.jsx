import React from 'react'
import api from '../api/axios'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function Post({ posts, setPosts, setRefresh }) {
    const [like, setLike] = useState('')
    const [editPostId, setEditPostId] = useState()
    const [editText, setEditText] = useState('')
    const editRef = useRef()
    const [openMenu, setOpenMenu] = useState(null)

    const handleDeletePost = async (postId) => {
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

    const username = localStorage.getItem('username')

    const updatedTime = (time) => {
        const current = new Date()
        const updated = new Date(time)
        const diff = (current - updated) / 1000
        return diff
    }

    return (
        <div className='flex flex-col items-center justify-center' >
            {
                posts.length === 0 ? <div>Post loading...</div> : posts.map(post => (
                    <div key={post._id} className='relative bg-white shadow-md m-3 p-6 rounded-md flex justify-between w-200 gap-3'>
                        <Link className="p-4 rounded bg-white hover:shadow-lg transition-all duration-200 w-full" to={`/post/${post._id}`}>
                            <div>
                                <div className='flex gap-3 items-center mb-2'>


                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div>
                                        <div className='w-10 h-10 bg-gray-300 items-center justify-center flex rounded-full font-bold text-lg'>
                                            {post.user?.username[0].toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <p className='font-semibold text-base'>{post.user?.username}</p>
                                        <div className='text-sm text-gray-500 flex'>
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
                                            {
                                                editPostId === post._id && <div onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                                                    <input ref={editRef} className="w-full p-2 border rounded-md" value={editText} onChange={(e) => { setEditText(e.target.value) }} onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleEditSave(post._id)
                                                        }
                                                    }} />
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleEditSave(post._id);
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleCancel();
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4 text-base leading-6 whitespace-pre-wrap wrap-break-words'>
                                    {post.text}
                                </div>
                            </div>
                        </Link>

                        {
                            username === post.user?.username && <div className="relative">
                                <div>

                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        setOpenMenu(
                                            openMenu === post._id ? null : post._id
                                        )
                                    }} className="text-xl text-gray-500 cursor-pointer hover:text-gray-700 h-8">
                                        &#8942;
                                    </button>
                                </div>

                                    {
                                        openMenu === post._id && <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md border min-w-28 overflow-hidden">
                                            <button
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleEditPost(post._id, post.text)
                                                    setOpenMenu(null)
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleDeletePost(post._id)
                                                    setOpenMenu(null)
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    }
                            </div>
                        }


                    </div>
                ))
            }
        </div>
    )
}

export default Post
