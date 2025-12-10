import { AuthToken, User } from "../../../tweeter-shared/src";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    let token = authToken.token;
    // TODO: Replace with the result of calling server
    return await this.serverFacade.getUser({ token, alias });
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server

    return this.serverFacade.login({ alias, password });
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    const token = authToken.token;
    await this.serverFacade.logout({ token });
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    return await this.serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension,
    });
  }
}
