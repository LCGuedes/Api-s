import { LoginRouter } from "./loginRouter";
import { MissingParamError } from "../errors/missingParamError";
import { ServerError } from "../errors/serverError";
import { UnauthorizedError } from "../errors/unauthorized";
import { AuthUseCase } from "../protocols/authUseCase";

export const makeSut = () => {
  class AuthUseCaseSpy implements AuthUseCase {
    email: string;
    password: string;
    accessToken: string;
    async auth(email: string, password: string) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = "valid_token";
  const sut = new LoginRouter(authUseCaseSpy);

  return {
    authUseCaseSpy,
    sut,
  };
};

describe("login router", () => {
  describe("email", () => {
    it("Should return status 400 if is not provided", async () => {
      const { sut } = makeSut();

      const httpRequest = {
        body: {
          password: "any_password",
        },
      };

      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new MissingParamError("email"));
    });
  });

  describe("password", () => {
    it("Should return status 400 if is not provided", async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: "any_email@email.com",
        },
      };

      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new MissingParamError("password"));
    });
  });

  describe("AuthUseCase", () => {
    it("Should call with correct params", () => {
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

    it("Should return status 401 when invalid credentials are provided", async () => {
      const { sut, authUseCaseSpy } = makeSut();
      authUseCaseSpy.accessToken = null;
      const httpRequest = {
        body: {
          email: "invalid_email@email.com",
          password: "invalid_passsword",
        },
      };

      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(401);
      expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    it("Should retun status 200 when valid credentials are provided", async () => {
      const { sut, authUseCaseSpy } = makeSut();
      const httpRequest = {
        body: {
          email: "any_email@email.com",
          password: "any_passsword",
        },
      };

      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(200);
      expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
    });
  });
});
