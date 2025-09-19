import { Controller, Get, Query } from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reserves')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Get()
  async list(@Query() query: any) {
    return await this.service.findAll(query);
  }
}
