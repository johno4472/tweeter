import { AuthToken, User } from "../../../tweeter-shared/src";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  setIsLoading(value: boolean): void;
  updateUserInfo(
    user: User,
    user1: User,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
  navigate(value: string): void;
}

export class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V> {
  public async doSignIn(
    authenticate: () => Promise<[User, AuthToken]>,
    navigation: (user: User) => void,
    rememberMe: boolean
  ) {
    this.view.setIsLoading(true);

    const [user, authToken] = await authenticate();

    this.view.updateUserInfo(user, user, authToken, rememberMe);

    navigation(user);
  }
}
