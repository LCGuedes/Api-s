import { SignUpController } from "../controllers/signUp";
import { MissingParamError } from "../errors/missingParamError";

const makeSut = () => {
  return new SignUpController();
};

describe("SignUp", () => {
  it("Should return status 400 if name is not provided", () => {
    const sut = makeSut();
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
    const sut = makeSut();
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
});
