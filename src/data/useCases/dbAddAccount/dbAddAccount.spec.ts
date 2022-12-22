import { DbAddAccount } from "./dbAddAccount";
import { AccountModel, Encrypter, AddAccountRepository } from "../../protocols";

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepositoryStub = () => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  encrypterStub: Encrypter;
  sut: DbAddAccount;
  addAccountRepository: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const addAccountRepository = makeAddAccountRepositoryStub();
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepository);
  return {
    sut,
    encrypterStub,
    addAccountRepository,
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

  it("Should throws if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const account = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(account);
    await expect(promise).rejects.toThrow();
  });

  it("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepository } = makeSut();
    const addSpy = jest.spyOn(addAccountRepository, "add");
    const account = {
      name: "valid_name",
      email: "valid_email",
      password: "valid _password",
    };
    await sut.add(account);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  it("Should throws if AddAccountRepository throws", async () => {
    const { sut, addAccountRepository } = makeSut();
    jest
      .spyOn(addAccountRepository, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const account = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(account);
    await expect(promise).rejects.toThrow();
  });

  it("Should return an account on success", async () => {
    const { sut } = makeSut();

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
});
