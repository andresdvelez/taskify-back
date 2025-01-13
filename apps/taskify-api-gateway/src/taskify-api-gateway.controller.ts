import { Controller, Get } from '@nestjs/common';
import { TaskifyApiGatewayService } from './taskify-api-gateway.service';

@Controller()
export class TaskifyApiGatewayController {
  constructor(private readonly taskifyApiGatewayService: TaskifyApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.taskifyApiGatewayService.getHello();
  }
}
