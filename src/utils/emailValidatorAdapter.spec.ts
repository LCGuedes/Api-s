import { EmailValidatorAdapter } from "./emailValidatorAdapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidatorAdapter", () => {
  it("Should return false when validator return false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@email.com");
    expect(isValid).toBe(false);
  });

  it("Should return true when validator return true", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid_email@email.com");
    expect(isValid).toBe(true);
  });

  it("Should call EmailValidator with correct email", () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(sut, "isValid");
    sut.isValid("any_email@email.com");
    expect(isEmailSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
