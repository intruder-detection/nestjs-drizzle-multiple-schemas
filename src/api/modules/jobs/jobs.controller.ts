import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobResponseDto } from '@api/modules/jobs/dtos/job-response.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getAllJobs(): Promise<JobResponseDto[]> {
    return this.jobsService.getAllJobs();
  }

  @Post()
  async addJob(@Body('jobName') jobName: string): Promise<Partial<JobResponseDto>> {
    return this.jobsService.addJob(jobName);
  }

  @Get(':id')
  async getById(@Param('id') jobId: string): Promise<JobResponseDto> {
    return this.jobsService.getById(jobId);
  }

  @Put(':id')
  async updateJob(@Param('id') jobId: string, @Body('jobName') jobName: string): Promise<Partial<JobResponseDto>[]> {
    return this.jobsService.updateJob(jobId, jobName);
  }

  @Delete(':id')
  async deleteJob(@Param('id') jobId: string): Promise<Partial<JobResponseDto>[]> {
    return this.jobsService.deleteJob(jobId);
  }
}
