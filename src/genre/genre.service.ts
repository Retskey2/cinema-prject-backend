import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGenreDto } from './dto/createGenre'
import { MovieService } from '../movie/movie.service'
import { Collection } from './genre.interface'


@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
    private readonly movieService: MovieService,
  ) {
  }

  /* Users endpoints */

  async getCollection() {
    const genres = await this.getAll()

    const collections = await Promise.all(
      genres.map(async (genre) => {
        const moviesByGenre = await this.movieService.byGenres([genre._id])

        const result: Collection = {
          _id: String(genre._id),
          title: genre.name,
          slug: genre.slug,
          image: (moviesByGenre.length > 0) ? moviesByGenre[0].bigPoster : "This genre is not used",
        }

        return result
      }),
    )

    return collections
  }

  async bySlug(slug: string) {
    const doc = await this.GenreModel.findOne({ slug }).exec()
    if (!doc) throw new NotFoundException('Genre not found!')
    return doc
  }

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm)
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    return this.GenreModel.find(options)
      .select('-updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec()
  }

  /* Admin endpoints */
  async byId(_id: string) {
    const genre = await this.GenreModel.findById(_id)
    if (!genre) throw new NotFoundException('Genre not found')

    return genre
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    }
    const genre = await this.GenreModel.create(defaultValue)
    return genre._id
  }

  async update(_id: string, dto: CreateGenreDto) {
    const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()

    if (!updateGenre) throw new NotFoundException('Genre not found!')

    return updateGenre
  }

  async delete(_id: string) {
    const deleteGenre = this.GenreModel.findByIdAndDelete(_id).exec()

    if (!deleteGenre) throw new NotFoundException('Genre not found!')

    return deleteGenre
  }
}
