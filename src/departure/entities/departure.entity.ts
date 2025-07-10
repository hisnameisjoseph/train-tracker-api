import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Station } from '../../station/entities/station.entity';

@Entity()
export class Departure {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Station, station => station.departures)
  @JoinColumn({ name: 'stationId' })
  station: Station;

  @Column()
  direction: string;

  @Column()
  platform: string;

  @Column()
  scheduledDepartureUtc: Date;

  @Column({ nullable: true })
  estimatedDepartureUtc: Date;
  
  @Column({ type: 'int', nullable: true })
  delayInMinutes: number;

  @CreateDateColumn()
  createdAt: Date;
}