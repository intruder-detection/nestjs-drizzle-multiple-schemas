import { JobEntity } from '@core/common/database/entities/job/job.entity';

export class JobResponseDto implements JobEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
