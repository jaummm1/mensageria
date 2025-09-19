import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from './entities/cliente.entity';
import { Quarto } from './entities/quarto.entity';
import { Reservado } from './entities/reservado.entity';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { ConsumerService } from './consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Cliente, Quarto, Reservado])],
  providers: [ReservasService, ConsumerService],
  controllers: [ReservasController],
  exports: [ReservasService]
})
export class ReservasModule {}
