import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Station } from '../../station/entities/station.entity';

@Entity()
export class Departure {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Station, station => station.departures)
  station: Station;

  @Column()
  direction: string;

  @Column()
  platform: string;

  @Column()
  scheduledDepartureUtc: Date;

  @Column({ nullable: true })
  estimatedDepartureUtc: Date;
}