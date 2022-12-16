import { HttpResponse } from "../helps/httpResponse";
import { AuthUseCaseSpy } from "./loginRouter.spec";

interface IhttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

export class LoginRouter {
  authUseCase: AuthUseCaseSpy | { auth?: undefined };
  constructor(authUseCase?: AuthUseCaseSpy | { auth?: undefined }) {
    this.authUseCase = authUseCase;
  }
  async route(httpRequest?: IhttpRequest) {
    try {
      const { email, password } = httpRequest.body;

      if (!email) return HttpResponse.badRequest("email");
      if (!password) return HttpResponse.badRequest("password");

      const accessToken = await this.authUseCase.auth(email, password);
      if (!accessToken) return HttpResponse.unauthorizedError();
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}
