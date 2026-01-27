import DBLocal from 'db-local'
import crypto from 'crypto'
import z from 'zod'

const { Schema } = new DBLocal({ path: './db' })

const Marquee = Schema('Marquee', {
  _id: { type: String, required: true },
  content: { type: String, required: true }
})

const marqueeSchema = z.object({
  content: z.string().min(1)
})

export class MarqueeDB {
  static async create ({ content }) {
    try {
      const parsed = marqueeSchema.parse({ content })

      const id = crypto.randomUUID()

      return await Marquee.create({
        _id: id,
        content: parsed.content
      }).save()
    } catch (error) {
      console.error(error)
      throw new Error('Invalid marquee data')
    }
  }

  static async updateOne ({ id, content }) {
    const marquee = Marquee.findOne({ _id: id })
    if (!marquee) {
      throw new Error('Marquee not found')
    }

    try {
      const parsed = marqueeSchema.parse({ content })

      if (parsed.content) marquee.content = parsed.content

      return await marquee.save()
    } catch (error) {
      throw new Error('Invalid marquee data')
    }
  }

  static async delete (id) {
    const marquee = Marquee.findOne({ _id: id })
    if (!marquee) {
      throw new Error('Marquee not found')
    }
    Marquee.remove({ _id: id })
    return { message: 'Marquee deleted' }
  }

  static getAll () {
    return Marquee.find({}) || []
  }

  static getByID (id) {
    return Marquee.findOne({ _id: id })
  }
}
