import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskifyApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
