import { User } from "../../../tweeter-shared/src";
import { UserService } from "../model.service/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  private userService: UserService = new UserService();

  public async doLogin(
    alias: string,
    password: string,
    originalUrl: string | undefined,
    rememberMe: boolean
  ) {
    await this.doFailureReportingOperation(
      async () => {
        await this.doSignIn(
          async () => {
            return await this.userService.login(alias, password);
          },
          (user: User) => {
            if (!!originalUrl) {
              this.view.navigate(originalUrl);
            } else {
              this.view.navigate(`/feed/${user.alias}`);
            }
          },
          rememberMe
        );
      },
      "log user in ",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
