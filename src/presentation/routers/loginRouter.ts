import { HttpResponse } from "../helps/httpResponse";
import { AuthUseCaseSpy } from "./loginRouter.spec";

interface IhttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

export class LoginRouter {
  authUseCase: AuthUseCaseSpy;
  constructor(authUseCase: AuthUseCaseSpy) {
    this.authUseCase = authUseCase;
  }
  route(httpRequest?: IhttpRequest) {
    if (!httpRequest) return HttpResponse.serverError("httpRequest");
    if (!httpRequest.body) return HttpResponse.serverError("body");

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");

    this.authUseCase.auth(email, password);
    return {
      statusCode: 401,
    };
  }
}
