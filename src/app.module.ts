import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config.service';
import { BrowserService } from './browser.sevice';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BrowserService, ConfigService],
})
export class AppModule {
  //
}
