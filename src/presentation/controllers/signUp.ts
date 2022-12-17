export class SignUpController {
  handle(httpRequest: any): any {
    const { email, name } = httpRequest;
    if (!email) return { statusCode: 400 };
    if (!name) return { statusCode: 400 };
  }
}
