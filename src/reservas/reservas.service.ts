import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from './entities/cliente.entity';
import { Quarto } from './entities/quarto.entity';
import { Reservado } from './entities/reservado.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva) private reservaRepo: Repository<Reserva>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    @InjectRepository(Quarto) private quartoRepo: Repository<Quarto>,
    @InjectRepository(Reservado) private reservadoRepo: Repository<Reservado>,
  ) {}

  async processPayload(payload: any) {
    const cust = payload.customer || {};
    let cliente = await this.clienteRepo.findOneBy({ external_id: String(cust.id || 'unknown') });
    if (!cliente) {
      cliente = this.clienteRepo.create({
        external_id: String(cust.id || 'unknown'),
        name: cust.name || 'unknown',
        email: cust.email || '',
        document: cust.document || '',
      });
      await this.clienteRepo.save(cliente);
    }

    const reserva = this.reservaRepo.create();
    reserva.uuid = payload.uuid;
    reserva.cliente = cliente;
    reserva.hotel_id = String((payload.hotel && payload.hotel.id) || 'unknown');
    reserva.hotel_name = (payload.hotel && payload.hotel.name) || '';
    reserva.created_at = payload.created_at || new Date().toISOString();
    reserva.indexed_at = new Date().toISOString();

    reserva.reservados = [];

    let totalReserva = 0;
    const rooms = payload.rooms || [];
    for (const r of rooms) {
      let quarto = await this.quartoRepo.findOneBy({ external_id: String(r.id || Math.random()) });
      if (!quarto) {
        quarto = this.quartoRepo.create({
          external_id: String(r.id || ''),
          room_number: r.room_number || '',
          daily_rate: Number(r.daily_rate || 0),
          category: (r.category && r.category.name) || null,
        });
        await this.quartoRepo.save(quarto);
      } else {
        quarto.daily_rate = Number(r.daily_rate || quarto.daily_rate);
        await this.quartoRepo.save(quarto);
      }

      const number_of_days = Number(r.number_of_days || 1);
      const total_value = quarto.daily_rate * number_of_days;
      totalReserva += total_value;

      const reservado = this.reservadoRepo.create({
        quarto,
        number_of_days,
        total_value,
        status: r.status || null,
        guests: r.guests || null,
        breakfast_included: r.breakfast_included || false,
      });
      reserva.reservados.push(reservado);
    }

    reserva.total_value = totalReserva;

    await this.reservaRepo.save(reserva);
    return reserva;
  }

  async findAll(filters: any) {
    const qb = this.reservaRepo
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.cliente', 'cliente')
      .leftJoinAndSelect('reserva.reservados', 'reservado')
      .leftJoinAndSelect('reservado.quarto', 'quarto');

    if (filters.uuid) qb.andWhere('reserva.uuid = :uuid', { uuid: filters.uuid });
    if (filters.clientId)
      qb.andWhere('cliente.external_id = :clientId', { clientId: String(filters.clientId) });
    if (filters.roomId)
      qb.andWhere('quarto.external_id = :roomId', { roomId: String(filters.roomId) });
    if (filters.hotelId)
      qb.andWhere('reserva.hotel_id = :hotelId', { hotelId: String(filters.hotelId) });

    const results = await qb.getMany();

    return results.map((r) => ({
      uuid: r.uuid,
      created_at: r.created_at,
      indexed_at: r.indexed_at,
      hotel: { id: r.hotel_id, name: r.hotel_name },
      customer: {
        id: r.cliente.external_id,
        name: r.cliente.name,
        email: r.cliente.email,
        document: r.cliente.document,
      },
      rooms: r.reservados.map((resv) => ({
        id: resv.quarto.external_id,
        room_number: resv.quarto.room_number,
        daily_rate: resv.quarto.daily_rate,
        number_of_days: resv.number_of_days,
        total_value: resv.total_value,
        status: resv.status,
        guests: resv.guests,
        breakfast_included: resv.breakfast_included,
      })),
      payment: null,
      metadata: null,
      total_value: r.total_value,
    }));
  }
}
