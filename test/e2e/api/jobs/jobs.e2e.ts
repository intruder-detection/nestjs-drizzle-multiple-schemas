import { RequestUtils } from '@test/utils/request.utils';
import { HttpMethods } from '@test/utils/enums/http-methods.enum';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '@test/utils/test.utils';
import { JobsModule } from '@api/modules/jobs/jobs.module';
import { JobEntity } from '@core/common/database/entities/job/job.entity';

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
  });

  describe('Get job by id', () => {

  });

  describe('Delete job by id', () => {
  });
});
