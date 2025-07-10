import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { signUrl } from './utils/sign-url';

// Added imports for PTV service
import { InjectRepository } from '@nestjs/typeorm';
import { Departure } from '../departure/entities/departure.entity';
import { Station } from '../station/entities/station.entity';
import { Repository } from 'typeorm';

export interface PtvDeparture {
  stop_id: number;
  route_id: number;
  run_id: number;
  direction_id: number;
  disruption_ids: number[];
  scheduled_departure_utc: string;
  estimated_departure_utc?: string;
  at_platform: boolean;
  platform_number?: string;
  flags: string;
  departure_sequence: number;
}

export interface PtvRoute {
  route_id: number;
  route_name: string;
  route_number: string;
  route_type: number;
  route_gtfs_id: string;
}

export interface PtvRun {
  run_id: number;
  route_id: number;
  route_type: number;
  final_stop_id: number;
  destination_name: string;
  status: string;
  direction_id: number;
  run_sequence: number;
  express_stop_count: number;
  vehicle_position?: any;
  vehicle_descriptor?: any;
}

export interface PtvStop {
  stop_id: number;
  stop_name: string;
  stop_suburb: string;
  route_type: number;
  stop_latitude: number;
  stop_longitude: number;
  stop_sequence: number;
}

export interface PtvDeparturesResponse {
  departures: PtvDeparture[];
  stops: Record<string, PtvStop>;
  routes: Record<string, PtvRoute>;
  runs: Record<string, PtvRun>;
  directions: Record<string, any>;
  status: {
    version: string;
    health: number;
  };
}

@Injectable()
export class PtvService {
  private readonly devId: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService, 
    @InjectRepository(Station)
  private stationRepository: Repository<Station>,
  @InjectRepository(Departure)
  private departureRepository: Repository<Departure>
) {
    this.devId = this.configService.get<string>('PTV_USER_ID') || '';
    this.apiKey = this.configService.get<string>('PTV_API_KEY') || '';

    if (!this.devId || !this.apiKey) {
      throw new Error('PTV_USER_ID and PTV_API_KEY must be set in environment variables');
    }
  }

  /**
   * Fetch departures for a specific stop (station) and route type
   * @param stopId - PTV Stop ID
   * @param routeType - Route type (0=Train, 1=Tram, 2=Bus, 3=Vline, 4=Night Bus)
   * @param maxResults - Maximum number of results (default: 5)
   * @param includeCancelled - Include cancelled services (default: false)
   */
  async getDepartures(
    stopId: number,
    routeType: number = 0, // Default to trains
    maxResults: number = 5,
    includeCancelled: boolean = false,
  ): Promise<PtvDeparturesResponse> {
    try {
      const path = `/v3/departures/route_type/${routeType}/stop/${stopId}`;
      const params = new URLSearchParams({
        max_results: maxResults.toString(),
        include_cancelled: includeCancelled.toString(),
        expand: 'all', // Include stops, routes, runs, and directions
      });

      const pathWithParams = `${path}?${params.toString()}`;
      const signedUrl = signUrl(pathWithParams, this.devId, this.apiKey);

      const response: AxiosResponse<PtvDeparturesResponse> = await axios.get(signedUrl, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TrainTracker/1.0',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.data?.message || 'Failed to fetch departures from PTV API';
        throw new HttpException(`PTV API Error: ${message}`, status);
      }
      throw new HttpException('Internal server error while fetching departures', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Fetch departures for a specific route at a stop
   * @param routeId - PTV Route ID
   * @param stopId - PTV Stop ID
   * @param maxResults - Maximum number of results (default: 5)
   */
  async getDeparturesForRoute(
    routeId: number,
    stopId: number,
    maxResults: number = 5,
  ): Promise<PtvDeparturesResponse> {
    try {
      const path = `/v3/departures/route/${routeId}/stop/${stopId}`;
      const params = new URLSearchParams({
        max_results: maxResults.toString(),
        expand: 'all',
      });

      const pathWithParams = `${path}?${params.toString()}`;
      const signedUrl = signUrl(pathWithParams, this.devId, this.apiKey);

      const response: AxiosResponse<PtvDeparturesResponse> = await axios.get(signedUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TrainTracker/1.0',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.data?.message || 'Failed to fetch route departures from PTV API';
        throw new HttpException(`PTV API Error: ${message}`, status);
      }
      throw new HttpException('Internal server error while fetching route departures', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Search for stops by name
   * @param searchTerm - Term to search for
   * @param routeTypes - Array of route types to filter by (optional)
   * @param maxResults - Maximum number of results (default: 10)
   */
  async searchStops(
    searchTerm: string,
    routeTypes?: number[],
    maxResults: number = 10,
  ): Promise<any> {
    try {
      const path = `/v3/search/${encodeURIComponent(searchTerm)}`;
      const params = new URLSearchParams({
        max_results: maxResults.toString(),
      });

      if (routeTypes && routeTypes.length > 0) {
        params.append('route_types', routeTypes.join(','));
      }

      const pathWithParams = `${path}?${params.toString()}`;
      const signedUrl = signUrl(pathWithParams, this.devId, this.apiKey);

      const response: AxiosResponse<any> = await axios.get(signedUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TrainTracker/1.0',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.data?.message || 'Failed to search stops from PTV API';
        throw new HttpException(`PTV API Error: ${message}`, status);
      }
      throw new HttpException('Internal server error while searching stops', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get routes for a specific route type
   * @param routeType - Route type (0=Train, 1=Tram, 2=Bus, 3=Vline, 4=Night Bus)
   */
  async getRoutes(routeType: number = 0): Promise<any> {
    try {
      const path = `/v3/routes`;
      const params = new URLSearchParams({
        route_types: routeType.toString(),
      });

      const pathWithParams = `${path}?${params.toString()}`;
      const signedUrl = signUrl(pathWithParams, this.devId, this.apiKey);

      const response: AxiosResponse<any> = await axios.get(signedUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TrainTracker/1.0',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.data?.message || 'Failed to fetch routes from PTV API';
        throw new HttpException(`PTV API Error: ${message}`, status);
      }
      throw new HttpException('Internal server error while fetching routes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async saveLiveDeparturesForStation(stationId: number): Promise<number> {
    const station = await this.stationRepository.findOneBy({ id: stationId });
    if (!station) {
      throw new Error(`Station with id ${stationId} not found.`);
    }

    const data = await this.getDepartures(station.ptvStationId, 0, 5);
    let savedCount = 0;

    for (const d of data.departures) {
      // ✅ Check for existing departure (same station and scheduled time)
      const existing = await this.departureRepository.findOne({
        where: {
          station: { id: station.id },
          scheduledDepartureUtc: new Date(d.scheduled_departure_utc),
        },
        relations: ['station'],
      });

      if (existing) continue;

      const delay = this.calculateDelayInMinutes(
        d.scheduled_departure_utc,
        d.estimated_departure_utc,
      );

      const departureData = {
        station: station,
        direction: data.directions[d.direction_id]?.direction_name || 'Unknown',
        platform: d.platform_number || 'N/A',
        scheduledDepartureUtc: new Date(d.scheduled_departure_utc),
        estimatedDepartureUtc: d.estimated_departure_utc ? new Date(d.estimated_departure_utc) : undefined,
        delayInMinutes: delay ?? undefined,
      };

      await this.departureRepository.save(departureData);
      savedCount++;
    }
    return savedCount;
  }
  private calculateDelayInMinutes(scheduled: string, estimated?: string): number | null {
    if (!scheduled || !estimated) return null;

    const start = new Date(scheduled).getTime();
    const end = new Date(estimated).getTime();
    const diff = Math.round((end - start) / (1000 * 60));
    return diff >= 0 ? diff : 0;
  }
}
