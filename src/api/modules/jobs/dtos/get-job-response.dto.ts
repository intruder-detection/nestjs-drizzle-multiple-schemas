import { JobEntity } from '@core/common/database/entities/job/job.entity';

export class GetJobResponseDto implements JobEntity {
  id: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}
