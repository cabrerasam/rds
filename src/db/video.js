import DBLocal from 'db-local'
import crypto from 'crypto'
import z from 'zod'

const { Schema } = new DBLocal({ path: './db' })

const Video = Schema('Video', {
  _id: { type: String, required: true },
  content: { type: String, required: true }
})

const videoSchema = z.object({
  content: z.string().min(1)
})

export class VideoDB {
  static async create ({ content }) {
    try {
      const parsed = videoSchema.parse({ content })

      const id = crypto.randomUUID()

      return await Video.create({
        _id: id,
        content: parsed.content
      }).save()
    } catch (error) {
      console.error(error)
      throw new Error('Invalid video data')
    }
  }

  static async updateOne ({ id, content }) {
    const video = Video.findOne({ _id: id })
    if (!video) {
      throw new Error('Video not found')
    }

    try {
      const parsed = videoSchema.parse({ content })

      if (parsed.content) video.content = parsed.content

      return await video.save()
    } catch (error) {
      throw new Error('Invalid video data')
    }
  }

  static async delete (id) {
    const video = Video.findOne({ _id: id })
    if (!video) {
      throw new Error('Video not found')
    }
    Video.remove({ _id: id })
    return { message: 'Video deleted' }
  }

  static getAll () {
    return Video.find({}) || []
  }

  static getByID (id) {
    return Video.findOne({ _id: id })
  }
}
