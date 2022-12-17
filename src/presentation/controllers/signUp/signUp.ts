import {
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Controller,
  AddAccount,
} from "../../controllers/signUp/signUpProtocols";
import { badRequest, serverError } from "../../helps";
import { InvalidParamError, MissingParamError } from "../../errors";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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
      const account = this.addAccount.add({
        name,
        email,
        password,
      });
      return {
        statusCode: 200,
        body: account,
      };
    } catch (error) {
      return serverError();
    }
  }
}
