import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GetJobResponseDto } from '@api/modules/jobs/dtos/get-job-response.dto';
import { JobEntityInsert } from '@core/common/database/entities/job/job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async addJob(@Body('jobName') jobName: string): Promise<JobEntityInsert[]> {
    return this.jobsService.addJob(jobName);
  }

  @Get()
  async getAllJobs(): Promise<GetJobResponseDto[]> {
    return this.jobsService.getAllJobs();
  }

  @Get(':id')
  async getById(@Param('id') jobId: string): Promise<GetJobResponseDto> {
    return this.jobsService.getById(jobId);
  }
}
