import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missingParamError";
import { badRequest } from "../helps/htppHelper";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const { name, email } = httpRequest.body;
    if (!name) return badRequest(new MissingParamError("name"));
    if (!email) return badRequest(new MissingParamError("email"));
  }
}
