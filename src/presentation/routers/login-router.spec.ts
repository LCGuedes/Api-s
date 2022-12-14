interface IhttpRequest {
  body: {
    email?: string;
    password?: string;
  };
}

class LoginRouter {
  route(httpRequest: IhttpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
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
});
