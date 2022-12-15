import { MissingParamError } from "./missingParamError";

export class HttpResponse {
  static badRequest(paramName: string): {
    statusCode: number;
    body?: MissingParamError;
  } {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }
  static serverError(paramName: string) {
    return {
      statusCode: 500,
      body: new MissingParamError(paramName),
    };
  }
}
