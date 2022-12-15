interface IhttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

class LoginRouter {
  route(httpRequest?: IhttpRequest) {
    if (!httpRequest) return HttpResponse.serverError("httpRequest");
    if (!httpRequest.body) return HttpResponse.serverError("body");

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");
  }
}

class HttpResponse {
  static badRequest(paramName: string) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }
  static serverError(paramName: string) {
    return {
      statusCode: 500,
      body: new MissingParamError(paramName),
    };
  }
}

class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`missing param ${paramName}`);
    this.name = "MissingParamError";
  }
}

describe("login router", () => {
  it("Should return status 400 if email is not provided", () => {
    const sut = new LoginRouter();

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
    const sut = new LoginRouter();
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
    const sut = new LoginRouter();

    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
  });

  it("Should return status 500 if httpRequest body is not provided", () => {
    const sut = new LoginRouter();

    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });
});
