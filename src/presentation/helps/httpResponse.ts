import { MissingParamError } from "./missingParamError";
import { ServerError } from "./serverError";
import { UnauthorizedError } from "../helps/unauthorized";
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

  static ok() {
    return {
      statusCode: 200,
      body: new Ok(),
    };
  }
}
