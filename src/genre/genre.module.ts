import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { GenreService } from './genre.service'
import { GenreController } from './genre.controller'
import { MovieModule } from '../movie/movie.module'


@Module({
  imports:[
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'Genre'
        }
      }
    ]),
    MovieModule
  ],
  providers: [GenreService],
  controllers: [GenreController]
})

export class GenreModule {}
