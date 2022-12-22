import { AccountModel } from "../../domain/models/Account";
import { AddAccountModel } from "../../domain/useCases/addAccount";

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
