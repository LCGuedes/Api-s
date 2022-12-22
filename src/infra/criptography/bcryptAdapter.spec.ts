import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcryptAdapter";

describe("bcryptAdapter", () => {
  it("Should call bcrypt with correct value", async () => {
    const salt = 12;
    const sut = new BcryptAdapter(12);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
});
