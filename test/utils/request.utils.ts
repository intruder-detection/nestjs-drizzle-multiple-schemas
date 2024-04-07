import { HttpStatus, INestApplication, InternalServerErrorException } from '@nestjs/common';
import request from 'supertest';
import { EndpointProperties } from '@test/utils/interfaces/endpoint-properties.interface';
import { HttpMethods } from '@test/utils/enums/http-methods.enum';

type SuperTestResponse<T> = Omit<request.Response, 'body'> & { body: T };

export class RequestUtils {
  private static wrapRequest(app: INestApplication, endpointProperties: EndpointProperties, payload = {}): request.Test {
    const req = request(app.getHttpServer());

    if (endpointProperties.method === HttpMethods.GET) {
      return req.get(endpointProperties.endpoint);
    } else if (endpointProperties.method === HttpMethods.POST) {
      return req.post(endpointProperties.endpoint).send(payload);
    } else if (endpointProperties.method === HttpMethods.PUT) {
      return req.put(endpointProperties.endpoint).send(payload);
    } else if (endpointProperties.method === HttpMethods.DELETE) {
      return req.delete(endpointProperties.endpoint);
    } else {
      throw new InternalServerErrorException('Unsupported method');
    }
  }

  private static async expectSpecificHttpCodeTest<T = any>(app: INestApplication, endpointProperties: EndpointProperties, payload: any, expectedStatus: HttpStatus): Promise<SuperTestResponse<T>> {
    return RequestUtils.wrapRequest(app as INestApplication, endpointProperties, payload).expect(expectedStatus);
  }

  static async performRequestAndExpectStatusOK<T = any>(
    app: INestApplication,
    endpointProperties: EndpointProperties,
    payload?: any,
  ): Promise<SuperTestResponse<T>> {
    return RequestUtils.expectSpecificHttpCodeTest(app, endpointProperties, payload, HttpStatus.OK);
  }

  static async performRequestAndExpectStatusCreated<T = any>(
    app: INestApplication,
    endpointProperties: EndpointProperties,
    payload?: any,
  ): Promise<SuperTestResponse<T>> {
    return RequestUtils.expectSpecificHttpCodeTest(app, endpointProperties, payload, HttpStatus.CREATED);
  }
}
