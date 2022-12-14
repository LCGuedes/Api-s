interface IhttpRequest {
  body: {
    email?: string;
    password?: string;
  };
}

class LoginRouter {
  route(httpRequest: IhttpRequest) {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe("login router", () => {
  it("Should return status 400 if no email is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
