import { AuthToken, User } from "../../../tweeter-shared/src";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItemFirst: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    let token = authToken.token;
    let lastItem = lastItemFirst?.dto ?? null;
    return await this.serverFacade.getMoreFollowees({
      token,
      userAlias,
      pageSize,
      lastItem,
    });
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItemFirst: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    let token = authToken.token;
    let lastItem = lastItemFirst?.dto ?? null;
    return await this.serverFacade.getMoreFollowers({
      token,
      userAlias,
      pageSize,
      lastItem,
    });
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    userFirst: User,
    selectedUserFirst: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    let token = authToken.token;
    let user = userFirst?.dto ?? null;
    let selectedUser = selectedUserFirst?.dto ?? null;
    return await this.serverFacade.getIsFollower({ token, user, selectedUser });
  }

  public async getFollowerCount(
    authToken: AuthToken,
    userFirst: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    let token = authToken.token;
    let user = userFirst?.dto ?? null;
    return await this.serverFacade.getFollowerCount({ token, user });
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    userFirst: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    let token = authToken.token;
    let user = userFirst?.dto ?? null;
    return await this.serverFacade.getFolloweeCount({ token, user });
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Call the server
    let token = authToken.token;
    let user = userToFollow?.dto ?? null;

    return await this.serverFacade.follow({ token, user });
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Call the server
    let token = authToken.token;
    let user = userToUnfollow?.dto ?? null;

    return await this.serverFacade.unfollow({ token, user });
  }
}
