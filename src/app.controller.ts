import {
  Body,
  Controller,
  Header,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    //
  }

  @Post()
  @Header('Content-type', 'application/pdf')
  @UseInterceptors(FileInterceptor('file'))
  async genPdf(
    @Body('content') content: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let htmlContent = content;
    if (file) {
      htmlContent = file.buffer.toString();
    }
    const pdf = await this.appService.genPdf(htmlContent);
    return new StreamableFile(pdf);
  }
}
