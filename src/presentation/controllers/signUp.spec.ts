import { SignUpController } from "../controllers/signUp";
import { EmailValidator } from "../protocols/emailValidator";
import { MissingParamError } from "../errors/missingParamError";
import { InvalidParamError } from "../errors/invalidParamError";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("SignUp", () => {
  it("Should return status 400 if name is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("name"));
  });

  it("Should return status 400 if email is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("email"));
  });

  it("Should return status 400 if a invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new InvalidParamError("email"));
  });

  it("Should return status 400 if password is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("password"));
  });

  it("Should return status 400 if confirmPassword is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("confirmPassword"));
  });
});
