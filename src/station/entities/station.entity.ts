import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Departure } from '../../departure/entities/departure.entity';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'ptv_station_id' })
  ptvStationId: number;

  @OneToMany(() => Departure, departure => departure.station)
  departures: Departure[];
}
