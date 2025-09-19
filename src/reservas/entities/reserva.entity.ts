import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Reservado } from './reservado.entity';

@Entity({ name: 'reserva' })
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @ManyToOne(() => Cliente, c => c.reservas, { cascade: true, eager: true })
  cliente: Cliente;

  @OneToMany(() => Reservado, r => r.reserva, { cascade: true, eager: true })
  reservados: Reservado[];

  @Column()
  hotel_id: string;

  @Column()
  hotel_name: string;

  @Column({ type: 'datetime' })
  created_at: string;

  @Column({ type: 'datetime' })
  indexed_at: string;

  @Column('real', { nullable: true })
  total_value: number;
}
