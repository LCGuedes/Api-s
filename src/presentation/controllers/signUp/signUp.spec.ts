import { SignUpController } from "./signUp";
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
} from "./signUpProtocols";
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from "../../errors";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
      };
      return fakeAccount;
    }
  }

  return new AddAccountStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe("SignUp", () => {
  it("Should return status 400 if name is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("name"));
  });

  it("Should return status 400 if email is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("email"));
  });

  it("Should return status 400 if a invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@email.com",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new InvalidParamError("email"));
  });

  it("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    sut.handle(httpRequest);

    expect(isValidSpy).toBeCalledWith("any_email@email.com");
  });

  it("Should return status 500 if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@email.com",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(500);
    expect(httpRespose.body).toEqual(new ServerError());
  });

  it("Should return status 400 if password is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("password"));
  });

  it("Should return status 400 if confirmPassword is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new MissingParamError("confirmPassword"));
  });

  it("Should return status 400 if confirmPassword fails", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        confirmPassword: "any_confirmPassword",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(400);
    expect(httpRespose.body).toEqual(new InvalidParamError("confirmPassword"));
  });

  it("Should call AddAcount with correct values", () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        confirmPassword: "any_password",
      },
    };

    sut.handle(httpRequest);

    expect(addSpy).toBeCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  it("Should return status 500 if AddAccount throws", () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        confirmPassword: "any_password",
      },
    };

    const httpRespose = sut.handle(httpRequest);

    expect(httpRespose.statusCode).toBe(500);
    expect(httpRespose.body).toEqual(new ServerError());
  });

  it("Should return status 200 if valid data is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@email.com",
        password: "any_password",
        confirmPassword: "any_password",
      },
    };

    const httpRespose = sut.handle(httpRequest);
    expect(httpRespose.statusCode).toBe(200);
    expect(httpRespose.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    });
  });
});
