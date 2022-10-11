import { Types } from 'mongoose'
import { IsObjectId } from 'class-validator-mongo-object-id'
import { IsNumber } from '@nestjs/class-validator'

export class SetRatingDto {
  @IsObjectId({message: 'moveId is invalid'})
  movieId: Types.ObjectId

  @IsNumber()
  value: number
}