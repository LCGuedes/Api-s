import { LoginRouter } from "./loginRouter";
import { MissingParamError } from "../helps/missingParamError";
import { ServerError } from "../helps/serverError";
import { UnauthorizedError } from "../helps/unauthorized";

export class AuthUseCaseSpy {
  email: string;
  password: string;
  auth(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

const makeSut = () => {
  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);

  return {
    authUseCaseSpy,
    sut,
  };
};

describe("login router", () => {
  it("Should return status 400 if email is not provided", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("Should return status 400 if password is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("Should return status 500 if httpRequest is not provided", () => {
    const { sut } = makeSut();

    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("Should return status 500 if httpRequest body is not provided", () => {
    const { sut } = makeSut();

    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("Should call AuthUseCase with correct params", () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_passsword",
      },
    };

    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  it("Should return status 401 when invalid credentials are provided", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: "invalid_email@email.com",
        password: "invalid_passsword",
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  it("Should return status 500 if AuthUseCase is not provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_passsword",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  it("Should return status 500 if AuthUseCase auth method is not provided", () => {
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_passsword",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });
});
