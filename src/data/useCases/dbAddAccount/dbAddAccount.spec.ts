import { DbAddAccount } from "./dbAddAccount";
import { Encrypter } from "../../protocols/encrypter";

describe("DbAddAccount", () => {
  it("Should call Encrypter with correct password", async () => {
    class EncrypterStub implements Encrypter {
      async encrypt(password: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_password"));
      }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
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
