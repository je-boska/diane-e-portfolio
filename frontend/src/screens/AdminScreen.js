import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import { UserContext } from '../UserContext'

const AdminScreen = ({ history }) => {
  const [posts, setPosts] = useState([])

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      getPosts()
    } else {
      history.push('/login')
    }
  }, [user, history])

  const getPosts = async () => {
    const { data } = await axios.get('/api/posts')
    setPosts(data)
  }

  const deleteHandler = async id => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
    }
    getPosts()
  }

  const logoutHandler = () => {
    setUser(null)
    sessionStorage.removeItem('user')
  }

  return (
    <>
      <div className='admin-buttons'>
        <Link to='/admin/createpost'>
          <button className='create-button'>
            <h3>CREATE POST</h3>
          </button>
        </Link>
        <button onClick={logoutHandler}>
          <h3>LOG OUT</h3>
        </button>
      </div>
      {posts.map(post => (
        <div className='post post-list' key={post._id}>
          <h2>{post.title}</h2>
          <div>
            <button onClick={() => deleteHandler(post._id)}>
              <h3>DELETE</h3>
            </button>
            <Link to={`/admin/edit/${post._id}`}>
              <button>
                <h3>EDIT</h3>
              </button>
            </Link>
          </div>
        </div>
      ))}
    </>
  )
}

export default AdminScreen
