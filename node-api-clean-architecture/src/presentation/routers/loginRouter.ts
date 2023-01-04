import { HttpResponse } from "../helps/httpResponse";
import { AuthUseCase } from "../protocols/authUseCase";
import { HttpRequest } from "../protocols/http";

export class LoginRouter {
  private readonly authUseCase: AuthUseCase;
  constructor(authUseCase: AuthUseCase) {
    this.authUseCase = authUseCase;
  }
  async route(httpRequest: HttpRequest) {
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
