import { RequestUtils } from '@test/utils/request.utils';
import { HttpMethods } from '@test/utils/enums/http-methods.enum';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '@test/utils/test.utils';
import { JobsModule } from '@api/modules/jobs/jobs.module';

describe('Jobs e2e', () => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await TestUtils.setupApplication([JobsModule])
  })

  describe('Create job', () => {
    it('Should create a job', async () => {
      await RequestUtils.performRequestAndExpectStatusCreated(app, {
        method: HttpMethods.POST,
        endpoint: '/jobs'
      }, {
        jobName: 'Test job name'
      });
    })
  });

  describe('All jobs /', () => {
  });

  describe('Job by id /', () => {

  });
});
