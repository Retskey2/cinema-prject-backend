import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieController } from './movie.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { MovieModel } from './movie.models'
import { TelegramModule } from '../telegram/telegram.module'

@Module({
  imports: [
    TypegooseModule.forFeature([
        {
          typegooseClass: MovieModel,
          schemaOptions: {
            collection: 'Movie',
          },
        },
      ],
    ),
    TelegramModule,
  ],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService]
})
export class MovieModule {}
