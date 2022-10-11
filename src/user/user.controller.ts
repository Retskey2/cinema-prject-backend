import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/UpdateUser.dto'
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { Types } from 'mongoose'
import { UserModel } from './user.model'


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id)
  }

  @Get('profile/favorites')
  @Auth()
  async getFavorites(
    @User('id') _id: Types.ObjectId,
  ) {
    return this.userService.getFavouritesMovies(_id)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile/favorites')
  @HttpCode(200)
  @Auth()
  async ToggleFavorite(
    @Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User() user: UserModel,
  ) {
    return this.userService.toggleFavourite(movieId, user)
  }


  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount()
  }

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(
    @User('id') _id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(_id, dto)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(
    @Param('id', IdValidationPipe) id: string,
  ) {
    return this.userService.delete(id)
  }

}
