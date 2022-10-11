import { IsString } from '@nestjs/class-validator'

export class CreateGenreDto {
  @IsString()
  name: string

  @IsString()
  slug: string

  @IsString()
  description: string

  @IsString()
  icon: string
}