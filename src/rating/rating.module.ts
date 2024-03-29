import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { RatingService } from './rating.service'
import { RatingController } from './rating.controller'
import { RatingModel } from './rating.model'
import { MovieModule } from '../movie/movie.module'
import { MovieService } from '../movie/movie.service'

@Module({
  imports: [
    TypegooseModule.forFeature([{
      typegooseClass: RatingModel,
      schemaOptions: {
        collection: 'Rating',
      },
    }]),
    MovieModule
  ],
  controllers: [RatingController],
  providers: [RatingService],
})

export class RatingModule {
}
