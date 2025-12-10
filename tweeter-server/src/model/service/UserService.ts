import { AuthToken, UserDto } from "tweeter-shared/src";
import { Service } from "./Service";
import { UserDAO } from "../dataAccess/interface/UserDAO";
import { AuthDAO } from "../dataAccess/interface/AuthDAO";
import { ImageDAO } from "../dataAccess/interface/ImageDAO";
import bcrypt from "bcryptjs";
import { DAOFactory } from "../dataAccess/interface/DAOFactory";

export class UserService implements Service {
  readonly userDAO: UserDAO;
  readonly authDAO: AuthDAO;
  readonly imageDAO: ImageDAO;

  public constructor(factory: DAOFactory) {
    this.userDAO = factory.getUserDAO();
    this.authDAO = factory.getAuthDao();
    this.imageDAO = factory.getImageDAO();
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    return this.userDAO.getUser(alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]> {
    let user = await this.userDAO.getUser(alias);

    if (
      user === null ||
      !(await bcrypt.compare(password, user.password)) ||
      password == null
    ) {
      throw new Error("Invalid alias or password");
    }
    let auth: AuthToken = AuthToken.Generate();

    await this.authDAO.insertAuthData(auth.token, alias, auth.timestamp);
    return [
      {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
      auth,
    ];
  }

  public async logout(token: string): Promise<void> {
    await this.authDAO.deleteAuthData(token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    if (
      firstName == null ||
      lastName == null ||
      alias == null ||
      password == null
    ) {
      throw new Error("Invalid registration inputs");
    }
    let preUser = await this.userDAO.getUser(alias);
    if (preUser != null) {
      throw new Error("User alias already taken");
    }

    let imageUrl: string = await this.imageDAO.putImage(
      imageFileExtension,
      userImageBytes
    );

    let hashedPassword = await bcrypt.hash(password, 10);
    await this.userDAO.insertUserData(
      alias,
      firstName,
      lastName,
      imageUrl,
      hashedPassword
    );

    let auth: AuthToken = AuthToken.Generate();
    this.authDAO.insertAuthData(auth.token, alias, auth.timestamp);

    return [
      {
        alias: alias,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      },
      auth,
    ];
  }

  public async authenticate(token: string): Promise<string> {
    if (token == null || token == undefined) {
      throw new Error("There ain't no auth token yall");
    }
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    let session = await this.authDAO.getAuthData(token);
    if (session == null || session == undefined) {
      throw new Error("invalid session");
    }
    if (Date.now() - session!.timeStamp > FIFTEEN_MINUTES) {
      this.authDAO.deleteAuthData(token);
      throw new Error("Your session has expired");
    } else {
      await this.authDAO.updateTimestamp(token);
      if (session.userAlias == null || session.userAlias == undefined) {
        throw new Error("Invalid auth token");
      }
      return session!.userAlias;
    }
  }
}
