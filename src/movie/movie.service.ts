import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { MovieModel } from './movie.models'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateMovieDto } from './update-movie.dto'
import { Types } from 'mongoose'
import { TelegramService } from '../telegram/telegram.service'

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
    private readonly telegramService: TelegramService,
  ) {
  }

  async getAll(seartchTerm?: string) {
    let options = {}

    if (seartchTerm)
      options = {
        $or: [
          { title: new RegExp(seartchTerm, 'i') },
        ],
      }

    return this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({
        created: 'desc',
      }).populate('actors genres')
      .exec()
  }

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug }).populate('actors genres').exec()
    if (!doc) throw new NotFoundException('Movie not found')
    return doc
  }

  async byActor(actorId: Types.ObjectId) {
    const doc = await this.MovieModel.find({ actors: actorId }).exec()
    if (!doc) throw new NotFoundException('Movie not found')
    return doc
  }

  async byGenres(
		genreIds: Types.ObjectId[]
	) {
		return this.MovieModel.find({ genres: { $in: genreIds } }).exec()
	}


  async getMostPopular() {
    return this.MovieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres').exec()
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.MovieModel.findOneAndUpdate({ slug },
      {
        $inc: { countOpened: 1 },
      },
      {
        new: true,
      }).exec()

    if (!updateDoc) throw new NotFoundException('Movie not found')
    return updateDoc
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.MovieModel.findOneAndUpdate(id, {
      rating: newRating,
    }, {
      new: true,
    }).exec()
  }

  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id)

    if (!movie) throw new NotFoundException('Movie not found')
    return movie
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    }
    const movie = await this.MovieModel.create(defaultValue)
    return movie._id
  }

  async update(_id: string, dto: UpdateMovieDto) {

    if (!dto.isSendTelegram) {
      await this.sendNotfication(dto)
      dto.isSendTelegram = true
    }

    const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()

    if (!updateDoc) throw new NotFoundException('Movie not found')
    return updateDoc
  }

  async delete(id: string) {
    const deleteDoc = await this.MovieModel.findByIdAndDelete(id)

    if (!deleteDoc) throw new NotFoundException('Movie not found')
    return deleteDoc
  }

  async sendNotfication(dto: UpdateMovieDto) {
    // if(process.env.NODE_ENV !== 'development' ){
    //   await this.telegramService.sendPhoto(dto.poster)
    // }
    await this.telegramService.sendPhoto('https://www.teachaway.com/sites/default/files/teachenglishinjapan4_1.jpg')
    const message = `<b>${dto.title}</b>\n\n`

    await this.telegramService.sendMessage(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: 'https://vk.com/hrinak',
              text: '👑 Go to watch!',
            },
          ],
        ],
      },
    })
  }
}
