import { Injectable } from '@nestjs/common';
import { JobDao } from '@core/common/database/entities/job/job.dao';
import { JobEntity, JobEntityInsert } from '@core/common/database/entities/job/job.entity';

@Injectable()
export class JobsService {
  constructor(private readonly jobDao: JobDao) {}

  async addJob(jobName: string): Promise<JobEntityInsert> {
    return await this.jobDao.insertNewRecord({
      name: jobName,
    });
  }

  async deleteJob(id: string): Promise<void> {
    return await this.jobDao.deleteById(id);
  }

  async getAllJobs(): Promise<JobEntity[]> {
    return this.jobDao.getAll();
  }

  async getById(id: string): Promise<JobEntity> {
    return (await this.jobDao.getOneById(id, ['id', 'createdAt', 'updatedAt', 'name'])) as JobEntity;
  }
}
