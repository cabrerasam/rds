import DBLocal from 'db-local'
import crypto from 'crypto'
import z from 'zod'

const { Schema } = new DBLocal({ path: './db' })

const Publicity = Schema('Publicity', {
  _id: { type: String, required: true },
  image: { type: String, required: true },
  position: { type: String, required: true }
})

const publicitySchema = z.object({
  image: z.string().optional(),
  position: z.string().optional()
})

export class PublicityDB {
  static async create ({ image, position }) {
    try {
      const parsed = publicitySchema.parse({ image, position })

      const id = crypto.randomUUID()

      return await Publicity.create({
        _id: id,
        image: parsed.image,
        position: parsed.position
      }).save()
    } catch (error) {
      console.error(error)
      throw new Error('Invalid publicity data')
    }
  }

  static async updateOne ({ id, image, position }) {
    const publicity = Publicity.findOne({ _id: id })
    if (!publicity) {
      throw new Error('Publicity not found')
    }

    try {
      const parsed = publicitySchema.parse({ image, position })

      if (parsed.image) publicity.image = parsed.image
      if (parsed.position) publicity.position = parsed.position

      return await publicity.save()
    } catch (error) {
      throw new Error('Invalid publicity data')
    }
  }

  static async delete (id) {
    const publicity = Publicity.findOne({ _id: id })
    if (!publicity) {
      throw new Error('Publicity not found')
    }
    Publicity.remove({ _id: id })
    return { message: 'Publicity deleted' }
  }

  static getAll () {
    return Publicity.find({}) || []
  }

  static getById (id) {
    return Publicity.findOne({ _id: id }) || null
  }
}
