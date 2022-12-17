import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missingParamError";
import { badRequest } from "../helps/htppHelper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/emailValidator";
import { InvalidParamError } from "../errors/invalidParamError";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password", "confirmPassword"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email);
    if (!isValid) return badRequest(new InvalidParamError("email"));
  }
}
