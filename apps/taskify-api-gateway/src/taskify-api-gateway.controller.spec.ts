import { Test, TestingModule } from '@nestjs/testing';
import { TaskifyApiGatewayController } from './taskify-api-gateway.controller';
import { TaskifyApiGatewayService } from './taskify-api-gateway.service';

describe('TaskifyApiGatewayController', () => {
  let taskifyApiGatewayController: TaskifyApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskifyApiGatewayController],
      providers: [TaskifyApiGatewayService],
    }).compile();

    taskifyApiGatewayController = app.get<TaskifyApiGatewayController>(TaskifyApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(taskifyApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
