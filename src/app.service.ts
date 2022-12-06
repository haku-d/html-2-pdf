import { Injectable } from '@nestjs/common';
import * as he from 'he';

import { BrowserService } from './browser.sevice';

@Injectable()
export class AppService {
  constructor(private readonly browserService: BrowserService) {
    //
  }
  async genPdf(content) {
    const decodedContent = he.decode(content);
    const browser = await this.browserService.getBrowser();
    const page = await browser.newPage();
    await page.setContent(decodedContent);
    const cssb = [];
    cssb.push('<style>');
    cssb.push('.pageInfo { font-size:12px; width: 100%; text-align: center}');
    cssb.push('</style>');
    const css = cssb.join('');
    const pdf = await page.pdf({
      format: 'a4',
      margin: {
        left: 20,
        top: 20,
        right: 20,
        bottom: 40,
      },
      displayHeaderFooter: true,
      headerTemplate: '',
      footerTemplate:
        css +
        '<span class="pageInfo">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>',
    });
    /**
     * Instead of closing the brower, just disconnect it from the instance
     */
    await page.close();
    await browser.disconnect();
    return pdf;
  }
}
