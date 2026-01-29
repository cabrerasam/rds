import { Router } from 'express'
import { VideoDB } from '../db/video.js'
import { authorization } from '../middleware/authorization.js'

export const videoRouter = () => {
  const router = Router()

  router.get('/', (req, res) => {
    const allVideos = VideoDB.getAll()
    res.send(allVideos)
  })

  router.get('/:id', authorization, async (req, res) => {
    const { id } = req.params
    try {
      const video = await VideoDB.getByID(id)
      if (!video) {
        return res.status(404).send({ error: 'Video not found' })
      }
      res.send(video)
    } catch (error) {
      res.status(500).send({ error: error.message || 'Internal server error' })
    }
  })

  router.post('/', authorization, async (req, res) => {
    const { content } = req.body

    try {
      if (!content) {
        return res.status(400).send({ error: 'Content is required' })
      }
      const result = await VideoDB.create({ content })
      res.status(201).send({ message: 'Video created successfully', videoId: result._id, content: result.content })
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' })
    }
  })

  router.put('/:id', authorization, async (req, res) => {
    const { id } = req.params
    const { content } = req.body

    try {
      const result = await VideoDB.updateOne({ id, content })
      res.send({ message: 'Video updated successfully', video: result })
    } catch (error) {
      res.status(500).send({ error: error.message || 'Internal server error' })
    }
  })

  router.delete('/:id', authorization, async (req, res) => {
    const { id } = req.params

    try {
      const result = await VideoDB.delete(id)
      res.send(result)
    } catch (error) {
      res.status(500).send({ error: error.message || 'Internal server error' })
    }
  })

  return router
}
