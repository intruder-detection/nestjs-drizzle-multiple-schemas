import { Controller, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GetJobResponseDto } from '@api/modules/jobs/dtos/get-job-response.dto';

@Controller('weather')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getAllJobs(): Promise<GetJobResponseDto[]> {
    return this.jobsService.getAllJobs();
  }

  @Get(':id')
  async getById( @Param('id') jobId: string): Promise<GetJobResponseDto> {
    return this.jobsService.getById(jobId);
  }
}
