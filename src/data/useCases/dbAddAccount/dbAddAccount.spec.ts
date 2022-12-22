import { DbAddAccount } from "./dbAddAccount";
import { Encrypter } from "../../protocols/encrypter";

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

interface SutTypes {
  encrypterStub: Encrypter;
  sut: DbAddAccount;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub,
  };
};

describe("DbAddAccount", () => {
  it("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const account = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(account);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
