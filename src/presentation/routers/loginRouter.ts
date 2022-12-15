import { HttpResponse } from "../helps/httpResponse";

interface IhttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

export class LoginRouter {
  route(httpRequest?: IhttpRequest) {
    if (!httpRequest) return HttpResponse.serverError("httpRequest");
    if (!httpRequest.body) return HttpResponse.serverError("body");

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");
  }
}
