import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common'
import { FileService } from './file.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FileController {
  constructor(private readonly filseService: FileService) {
  }

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.filseService.saveFiles([file], folder)
  }
}
