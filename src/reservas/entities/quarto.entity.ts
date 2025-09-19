import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservado } from './reservado.entity';

@Entity({ name: 'quarto' })
export class Quarto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  external_id: string;

  @Column()
  room_number: string;

  @Column('real')
  daily_rate: number;

  @Column({ nullable: true })
  category: string;

  @OneToMany(() => Reservado, r => r.quarto)
  reservados: Reservado[];
}
