import { MissingParamError } from "../errors/missingParamError";
import { ServerError } from "../errors/serverError";
import { UnauthorizedError } from "../errors/unauthorized";
import { Ok } from "./ok";

export class HttpResponse {
  static badRequest(paramName: string) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }
  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    };
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }

  static ok(data: { accessToken: string }): any {
    return {
      statusCode: 200,
      body: data,
    };
  }
}
