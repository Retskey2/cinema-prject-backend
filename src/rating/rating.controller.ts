import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { RatingService } from './rating.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from '../user/decorators/user.decorator'
import { Types } from 'mongoose'
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { SetRatingDto } from './set-rating.dto'

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId) {
    return this.ratingService.getMovieValueByUser(movieId, _id)
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(
    @Body() dto: SetRatingDto,
    @User('_id') _id: Types.ObjectId) {
    return this.ratingService.setRating(_id, dto)
  }
}
