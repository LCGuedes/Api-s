import { HttpResponse } from "../helps/httpResponse";

interface IhttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

export class LoginRouter {
  authUseCase: any;
  constructor(authUseCase: any) {
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
