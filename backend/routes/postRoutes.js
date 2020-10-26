import express from 'express'
import Post from '../models/postModel.js'
import { protect } from '../middleware/authMiddleware.js'
import { uploader } from 'cloudinary'

const router = express.Router()

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  const posts = await Post.find({})

  res.json(posts)
})

// @desc    Fetch post by ID
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    res.json(post)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a post
// @route   POST /api/posts
// @access  Public for now
router.post('/', protect, async (req, res) => {
  const { title, text, image } = req.body

  const post = new Post({
    title,
    text,
    image,
  })

  const createdPost = await post.save()
  res.status(201).json(createdPost)
})

// @desc    Delete a post
// @route   DELETE /api/post
// @access  Public
router.delete('/:id', protect, async (req, res) => {
  const post = await Post.findById(req.params.id)
  const { image } = post
  const imagePublicId = image.slice(-24, -4)

  if (post) {
    await post.remove()
    res.json({ message: 'Post deleted' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }

  uploader.destroy(imagePublicId, (err, res) => {
    console.log(res, err)
  })
})

// @desc    Update a post
// @route   DELETE /api/post
// @access  Public
router.put('/:id', protect, async (req, res) => {
  const { title, text, image } = req.body

  const post = await Post.findById(req.params.id)

  const prevImage = post.image
  const prevImagePublicId = prevImage.slice(-24, -4)

  if (post) {
    post.title = title
    post.text = text
    post.image = image

    const updatedPost = await post.save()
    res.json(updatedPost)

    uploader.destroy(prevImagePublicId, (err, res) => {
      console.log(res, err)
    })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

export default router
