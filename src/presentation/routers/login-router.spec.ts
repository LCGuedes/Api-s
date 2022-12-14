interface IhttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

class LoginRouter {
  route(httpRequest?: IhttpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500,
      };
    }
    const { email, password } = httpRequest.body;

    if (!email || !password) {
      return {
        statusCode: 400,
      };
    }
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
