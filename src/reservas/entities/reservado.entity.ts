import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from './reserva.entity';
import { Quarto } from './quarto.entity';

@Entity({ name: 'reservado' })
export class Reservado {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reserva, r => r.reservados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @ManyToOne(() => Quarto, q => q.reservados, { cascade: true, eager: true })
  @JoinColumn({ name: 'quarto_id' })
  quarto: Quarto;

  @Column()
  number_of_days: number;

  @Column('real')
  total_value: number;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  guests: number;

  @Column({ default: false })
  breakfast_included: boolean;
}
