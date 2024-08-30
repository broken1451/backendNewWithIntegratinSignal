import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      console.log(`\x1b[36m${method} ${url} ${statusCode}\x1b[0m`);
        // `${method} ${url} ${statusCode} ${contentLength} - ${userAgent}`,
    });

    next();
  }
}