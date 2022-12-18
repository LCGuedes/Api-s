import { EmailValidatorAdapter } from "./emailValidatorAdapter";

describe("EmailValidatorAdapter", () => {
  it("Should return false when validator return false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("any_email@email.com");
    expect(isValid).toBe(false);
  });
});
