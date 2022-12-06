import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

import { ConfigService } from './config.service';

@Injectable()
export class BrowserService {
  private browserWSEndpoint;
  private browser: puppeteer.Browser;

  constructor(private readonly configService: ConfigService) {
    //
  }

  async getBrowser(): Promise<puppeteer.Browser> {
    try {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: this.browserWSEndpoint,
      });
      console.log('Connected to a browser instance');
    } catch (_) {
      console.log('Launching new browser instance');
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: this.configService.isDevelopment
          ? null
          : '/usr/bin/google-chrome',
      });
      this.browserWSEndpoint = this.browser.wsEndpoint();
    }

    return this.browser;
  }
}
