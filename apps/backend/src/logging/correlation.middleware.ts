import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.id = req.headers['x-correlation-id'] || randomUUID();
    next();
  }
}