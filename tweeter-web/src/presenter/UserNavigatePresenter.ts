import { AuthToken, User } from "../../../tweeter-shared/src";
import { UserService } from "../model.service/UserService";

export class UserNavigatePresenter {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias);
  }
}
