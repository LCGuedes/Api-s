import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missingParamError";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const { email, name } = httpRequest.body;
    if (!email)
      return { statusCode: 400, body: new MissingParamError("email") };
    if (!name) return { statusCode: 400, body: new MissingParamError("name") };
  }
}
