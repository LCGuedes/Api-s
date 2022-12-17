import {
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Controller,
} from "../protocols";
import { badRequest, serverError } from "../helps";
import { InvalidParamError, MissingParamError } from "../errors";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ["name", "email", "password", "confirmPassword"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }
      const { name, email, password, confirmPassword } = httpRequest.body;
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) return badRequest(new InvalidParamError("email"));
      if (password !== confirmPassword)
        return badRequest(new InvalidParamError("confirmPassword"));
    } catch (error) {
      return serverError();
    }
  }
}
