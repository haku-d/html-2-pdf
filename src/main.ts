import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { ConfigService } from './config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms - :user-agent',
    ),
  );

  const configService = app.get(ConfigService);

  const port = configService.getNumber('PORT') || 5000;
  const appName = configService.get('APP_NAME') || 'Service';

  await app.listen(port);

  console.info(`${appName} is running on port ${port}`);
}
bootstrap();
