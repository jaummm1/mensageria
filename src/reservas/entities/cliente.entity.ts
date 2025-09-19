import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity({ name: 'cliente' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  external_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  document: string;

  @OneToMany(() => Reserva, r => r.cliente)
  reservas: Reserva[];
}
