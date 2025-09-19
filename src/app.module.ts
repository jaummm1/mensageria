import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasModule } from './reservas/reservas.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'data', 'reservas.sqlite'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    ReservasModule
  ]
})
export class AppModule {}
