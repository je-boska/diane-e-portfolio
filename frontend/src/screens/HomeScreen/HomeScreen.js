import React, { useState, useEffect } from 'react'
import './HomeScreen.css'
import axios from 'axios'
import Section from '../../components/Section/Section'

const HomeScreen = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/posts')
      setPosts(data)
    }
    getData()
  }, [])

  return (
    <>
      {posts
        .sort((a, b) => (a.position > b.position ? -1 : 1))
        .map(post => (
          <section key={post._id} className='post'>
            {post.sections.length === 1 ? (
              <Section post={post} layout='one-layout' />
            ) : post.sections.length === 2 ? (
              <Section post={post} layout='two-layout' />
            ) : post.sections.length === 3 ? (
              <Section post={post} layout='three-layout' />
            ) : post.sections.length === 4 ? (
              <Section post={post} layout='four-layout' />
            ) : null}
          </section>
        ))}
    </>
  )
}

export default HomeScreen
