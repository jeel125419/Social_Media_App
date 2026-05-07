import {useState} from 'react'
import api from '../api/axios'

function Dashboard() {
    // const [text, setText] = useState('')
    // const handleCreatePost = async () => {

    //     try{
    //         const token = localStorage.getItem('token')
            
    //         const res = await api.post('/createPost', {content: text}, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         console.log(res.data)
    //     } catch(e) {
    //         console.log(e)
    //     } finally{
    //         setText('')
    //     }

    // }
  return (
    <div>
        {/* <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleCreatePost}>Create post</button> */}
    </div>
  )
}

export default Dashboard
