import { AuthToken } from "../../../tweeter-shared/src";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavBarView extends MessageView {
  clearUserInfo(): void;
  navigate(value: string): void;
}

export class AppNavBarPresenter extends Presenter<AppNavBarView> {
  private _userService: UserService = new UserService();

  constructor(view: AppNavBarView) {
    super(view);
    this._userService = new UserService();
  }

  public get service() {
    return this._userService;
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    await this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }
}
