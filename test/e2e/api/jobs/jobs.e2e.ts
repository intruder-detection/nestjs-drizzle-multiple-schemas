import { RequestUtils } from '@test/utils/request.utils';
import { HttpMethods } from '@test/utils/enums/http-methods.enum';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '@test/utils/test.utils';
import { JobsModule } from '@api/modules/jobs/jobs.module';
import { JobEntity, JobEntityInsert } from '@core/common/database/entities/job/job.entity';

describe('Jobs e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await TestUtils.setupApplication([JobsModule]);
  });

  describe('Create job', () => {
    it('Should create a job', async () => {
      const { body } = await RequestUtils.performRequestAndExpectStatusCreated<JobEntity>(app, {
        method: HttpMethods.POST,
        endpoint: '/jobs'
      }, {
        jobName: 'Test job name'
      });

      expect(body).toMatchObject({
        id: expect.any(String),
        name: 'Test job name',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      } satisfies JobEntity)
    });
  });

  describe('List all jobs', () => {
    it('Should list all jobs', async () => {
      const { body: existingJobs } = await RequestUtils.performRequestAndExpectStatusOK<JobEntityInsert[]>(app, {
        method: HttpMethods.GET,
        endpoint: '/jobs'
      });

      expect(existingJobs).toHaveLength(1);

      for (const job of existingJobs) {
        expect(job).toMatchObject({
          id: expect.any(String),
          name: 'Test job name',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        } satisfies JobEntity)
      }
    });
  });

  describe('Get job by id', () => {

  });

  describe('Delete job by id', () => {
  });
});
