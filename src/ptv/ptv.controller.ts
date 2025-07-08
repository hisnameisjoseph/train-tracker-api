import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PtvService, PtvDeparturesResponse } from './ptv.service';

@Controller('ptv')
export class PtvController {
  constructor(private readonly ptvService: PtvService) {}

  @Get('departures/stop/:stopId')
  async getDepartures(
    @Param('stopId', ParseIntPipe) stopId: number,
    @Query('routeType') routeType?: string,
    @Query('maxResults') maxResults?: string,
    @Query('includeCancelled') includeCancelled: string = 'false',
  ): Promise<PtvDeparturesResponse> {
    const routeTypeNum = routeType ? parseInt(routeType) : 0;
    const maxResultsNum = maxResults ? parseInt(maxResults) : 5;
    const includeCancel = includeCancelled.toLowerCase() === 'true';
    return await this.ptvService.getDepartures(stopId, routeTypeNum, maxResultsNum, includeCancel);
  }

  @Get('departures/route/:routeId/stop/:stopId')
  async getDeparturesForRoute(
    @Param('routeId', ParseIntPipe) routeId: number,
    @Param('stopId', ParseIntPipe) stopId: number,
    @Query('maxResults') maxResults?: string,
  ): Promise<PtvDeparturesResponse> {
    const maxResultsNum = maxResults ? parseInt(maxResults) : 5;
    return await this.ptvService.getDeparturesForRoute(routeId, stopId, maxResultsNum);
  }

  @Get('search/:searchTerm')
  async searchStops(
    @Param('searchTerm') searchTerm: string,
    @Query('routeTypes') routeTypes?: string,
    @Query('maxResults') maxResults?: string,
  ): Promise<any> {
    const maxResultsNum = maxResults ? parseInt(maxResults) : 10;
    const routeTypeArray = routeTypes ? routeTypes.split(',').map(Number) : undefined;
    return await this.ptvService.searchStops(searchTerm, routeTypeArray, maxResultsNum);
  }

  @Get('routes')
  async getRoutes(@Query('routeType') routeType?: string): Promise<any> {
    const routeTypeNum = routeType ? parseInt(routeType) : 0;
    return await this.ptvService.getRoutes(routeTypeNum);
  }
}
