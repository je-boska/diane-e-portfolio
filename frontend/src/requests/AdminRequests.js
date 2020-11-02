import axios from 'axios'
import { deleteImage } from './EditPostRequests'

export async function createPost(token) {
  const {
    data: { _id },
  } = await axios.post(
    '/api/posts',
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return _id
}

export async function deletePost(token, id) {
  const post = await axios.get(`/api/posts/${id}`)
  const { sections } = post.data
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].image) {
      deleteImage(sections[i].image, token)
    }
  }
  await axios.delete(`/api/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getAllPosts() {
  const { data } = await axios.get('/api/posts')
  return data
}