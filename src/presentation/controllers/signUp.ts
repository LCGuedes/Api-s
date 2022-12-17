import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missingParamError";
import { badRequest } from "../helps/htppHelper";
import { Controller } from "../protocols/controller";

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password", "confirmPassword"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }
  }
}
