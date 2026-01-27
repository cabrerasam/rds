import { Router } from 'express'
import { MarqueeDB } from '../db/marqee.js'
import { authorization } from '../middleware/authorization.js'

export const marqueeRouter = () => {
  const router = Router()

  router.get('/', (req, res) => {
    const allMarquees = MarqueeDB.getAll()
    res.send(allMarquees)
  })

  router.get('/:id', authorization, async (req, res) => {
    const { id } = req.params
    try {
      const marquee = await MarqueeDB.getByID(id)
      if (!marquee) {
        return res.status(404).send({ error: 'Marquee not found' })
      }
      res.send(marquee)
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
      const result = await MarqueeDB.create({ content })
      res.status(201).send({ message: 'Marquee created successfully', marqueeId: result._id, content: result.content })
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' })
    }
  })

  router.put('/:id', authorization, async (req, res) => {
    const { id } = req.params
    const { content } = req.body

    try {
      const result = await MarqueeDB.updateOne({ id, content })
      res.send({ message: 'Marquee updated successfully', marquee: result })
    } catch (error) {
      res.status(500).send({ error: error.message || 'Internal server error' })
    }
  })

  router.delete('/:id', authorization, async (req, res) => {
    const { id } = req.params

    try {
      const result = await MarqueeDB.delete(id)
      res.send(result)
    } catch (error) {
      res.status(500).send({ error: error.message || 'Internal server error' })
    }
  })

  return router
}
