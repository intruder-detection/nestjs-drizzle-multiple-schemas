import { RequestUtils } from '@test/utils/request.utils';
import { HttpMethods } from '@test/utils/enums/http-methods.enum';
import { INestApplication } from '@nestjs/common';
import { TestUtils } from '@test/utils/test.utils';
import { JobsModule } from '@api/modules/jobs/jobs.module';
import { JobDao } from '@core/common/database/entities/job/job.dao';
import { JobResponseDto } from '@api/modules/jobs/dtos/job-response.dto';

describe('Jobs e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await TestUtils.setupApplication([JobsModule]);
  });

  function expectedJobResponseDto() {
    return {
      id: expect.any(String),
      name: 'Test job name',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    } satisfies Partial<JobResponseDto>;
  }

  describe('Create job', () => {
    it('Should create a job', async () => {
      const { body: createdJob } = await RequestUtils.performRequestAndExpectStatusCreated<JobResponseDto>(
        app,
        {
          method: HttpMethods.POST,
          endpoint: '/jobs',
        },
        {
          jobName: 'Test job name',
        },
      );

      expect(createdJob).toMatchObject(expectedJobResponseDto());
    });
  });

  describe('List all jobs', () => {
    it('Should list all jobs', async () => {
      const { body: existingJobs } = await RequestUtils.performRequestAndExpectStatusOK<JobResponseDto[]>(app, {
        method: HttpMethods.GET,
        endpoint: '/jobs',
      });

      expect(existingJobs).toHaveLength(1);

      for (const job of existingJobs) {
        expect(job).toMatchObject(expectedJobResponseDto());
      }
    });
  });

  describe('Get job by id', () => {
    it('Should get a job by id', async () => {
      const existingJobs = await app.get(JobDao).getAll();
      expect(existingJobs).toHaveLength(1);
      const existingJob = existingJobs.at(-1);

      const { body: jobRetrieved } = await RequestUtils.performRequestAndExpectStatusOK<JobResponseDto>(app, {
        method: HttpMethods.GET,
        endpoint: `/jobs/${existingJob.id}`,
      });

      expect(jobRetrieved.id).toEqual(existingJob.id);
    });
  });

  describe('Update job by id', () => {
    it('Should update a job by id', async () => {
      const existingJobs = await app.get(JobDao).getAll();
      expect(existingJobs).toHaveLength(1);
      const existingJob = existingJobs.at(-1);

      const { body: jobsUpdated } = await RequestUtils.performRequestAndExpectStatusOK<JobResponseDto[]>(app, {
        method: HttpMethods.PUT,
        endpoint: `/jobs/${existingJob.id}`,
      }, {
        jobName: 'This is a new name for the job',
      });

      expect(jobsUpdated).toHaveLength(1);
      const jobUpdated = jobsUpdated.at(-1);
      expect(jobUpdated.id).toEqual(existingJob.id);
      expect(jobUpdated.name).toEqual('This is a new name for the job');
    });
  });

  describe('Delete job by id', () => {
    it('Should delete a job by id', async () => {
      let existingJobs = await app.get(JobDao).getAll();
      expect(existingJobs).toHaveLength(1);
      const existingJob = existingJobs.at(-1);

      const { body: jobsDeleted } = await RequestUtils.performRequestAndExpectStatusOK<JobResponseDto[]>(app, {
        method: HttpMethods.DELETE,
        endpoint: `/jobs/${existingJob.id}`,
      });

      expect(jobsDeleted).toHaveLength(1);
      const jobDeleted = jobsDeleted.at(-1);
      expect(jobDeleted.id).toEqual(existingJob.id);

      existingJobs = await app.get(JobDao).getAll();
      expect(existingJobs).toHaveLength(0);
    });
  });
});
