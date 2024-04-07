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

  async deleteJob(id: string): Promise<JobEntityInsert[]> {
    return await this.jobDao.deleteById(id);
  }

  async deleteJobs(): Promise<JobEntityInsert[]> {
    return await this.jobDao.deleteAll();
  }

  async getAllJobs(): Promise<JobEntity[]> {
    return this.jobDao.getAll();
  }

  async getById(id: string): Promise<JobEntity> {
    return (await this.jobDao.getOneById(id, ['id', 'createdAt', 'updatedAt', 'name'])) as JobEntity;
  }

  async updateJob(id: string, newName: string): Promise<JobEntityInsert[]> {
    return this.jobDao.updateById(id, { name: newName })
  }
}
