import { Injectable } from '@nestjs/common';
import { JobDao } from '@core/common/database/entities/job/job.dao';
import { JobEntity } from '@core/common/database/entities/job/job.entity';

@Injectable()
export class JobsService {
  constructor(private readonly jobDao: JobDao) {}

  async getAllJobs(): Promise<JobEntity[]> {
    return this.jobDao.getAll();
  }

  async getById(id: string): Promise<JobEntity> {
    return (await this.jobDao.getOneById(id, ['id', 'createdAt', 'updatedAt', 'fullName'])) as JobEntity;
  }
}
