import { HttpMethods } from '@test/utils/enums/http-methods.enum';

export interface EndpointProperties {
  method: HttpMethods;
  endpoint: string;
}
