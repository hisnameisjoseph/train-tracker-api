import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Departure } from '../../departure/entities/departure.entity';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ptvStationId: number;

  @OneToMany(() => Departure, departure => departure.station)
  departures: Departure[];
}
