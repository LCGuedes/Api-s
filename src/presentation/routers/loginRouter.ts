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
  route(httpRequest?: IhttpRequest) {
    if (!httpRequest) return HttpResponse.serverError();
    if (!httpRequest.body) return HttpResponse.serverError();
    if (!this.authUseCase) return HttpResponse.serverError();
    if (!this.authUseCase.auth) return HttpResponse.serverError();

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");

    const accessToken = this.authUseCase.auth(email, password);
    if (!accessToken) return HttpResponse.unauthorizedError();
    return HttpResponse.ok({ accessToken });
  }
}
