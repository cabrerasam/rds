import { Router } from 'express'
import { PublicityDB } from '../db/publicity.js'
import { authorization } from '../middleware/authorization.js'

export const publicityRouter = () => {
  const router = Router()

  router.get('/', (req, res) => {
    const allPublicity = PublicityDB.getAll()
    res.send(allPublicity)
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    const publicity = PublicityDB.getById(id)
    if (!publicity) {
      return res.status(404).send({ error: 'Publicity not found' })
    }
    res.send(publicity)
  })

  router.post('/', authorization, async (req, res) => {
    const { image, position } = req.body

    try {
      if (!image) {
        return res.status(400).send({ error: 'Image is required' })
      }
      const result = await PublicityDB.create({ image, position })
      res.status(201).send({ message: 'Publicity created successfully', publicityId: result._id })
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' })
    }
  })

  router.put('/:id', authorization, async (req, res) => {
    const { id } = req.params
    const { image, position } = req.body

    try {
      const result = await PublicityDB.updateOne({ id, image, position })
      res.send({ message: 'Publicity updated successfully', publicity: result })
    } catch (error) {
      res.status(500).send({ error: error.message || 'Internal server error' })
    }
  })

  router.delete('/:id', authorization, async (req, res) => {
    const { id } = req.params

    try {
      const result = await PublicityDB.delete(id)
      res.send(result)
    } catch (error) {
      res.status(500).send({ error: error.message || 'Internal server error' })
    }
  })

  return router
}
