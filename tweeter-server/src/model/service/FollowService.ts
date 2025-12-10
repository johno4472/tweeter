import { UserDto } from "tweeter-shared/src";
import { Service } from "./Service";
import { FollowDAO } from "../dataAccess/interface/FollowDAO";
import { UserDAO } from "../dataAccess/interface/UserDAO";
import { DAOFactory } from "../dataAccess/interface/DAOFactory";
import { DataPage } from "../domain/DataPage";

export class FollowService implements Service {
  readonly followDAO: FollowDAO;
  readonly userDAO: UserDAO;

  public constructor(factory: DAOFactory) {
    this.followDAO = factory.getFollowDAO();
    this.userDAO = factory.getUserDAO();
  }

  loadMoreFollowees = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    return await this.loadMoreFollowItems(async () => {
      return this.followDAO.getFollowItems(
        userAlias,
        false,
        pageSize,
        lastItem?.alias ?? null
      );
    });
  };

  loadMoreFollowers = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    return await this.loadMoreFollowItems(async () => {
      return this.followDAO.getFollowItems(
        userAlias,
        true,
        pageSize,
        lastItem?.alias ?? null
      );
    });
  };

  public async loadMoreFollowItems(
    operation: () => Promise<DataPage<string>>
  ): Promise<[UserDto[], boolean]> {
    let followData: DataPage<string> = await operation();
    const userInfo: UserDto[] = (
      await Promise.all(
        followData.values.map(async (value) => {
          const user = await this.userDAO.getUser(value);
          if (!user) return null;

          const { password, ...safeUser } = user;

          return safeUser as UserDto;
        })
      )
    ).filter((user): user is UserDto => user !== null);

    return [userInfo, followData.hasMorePages];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    return await this.followDAO.getIsFollower(user.alias, selectedUser.alias);
  }

  public async getFollowCounts(
    token: string,
    user: string
  ): Promise<[number, number]> {
    return await this.userDAO.getFollowCount(user);
  }

  follow = async (
    rootUser: string,
    token: string,
    userToFollow: string
  ): Promise<[followerCount: number, followeeCount: number]> => {
    await this.userDAO.updateFollowCount(rootUser, false, true);
    await this.userDAO.updateFollowCount(userToFollow, true, true);

    // TODO: Call the server
    await this.followDAO.addFollowItem(rootUser, userToFollow);

    const followCounts = await this.getFollowCounts(token, userToFollow);

    return followCounts;
  };

  unfollow = async (
    rootUser: string,
    token: string,
    userToUnfollow: string
  ): Promise<[followerCount: number, followeeCount: number]> => {
    await this.userDAO.updateFollowCount(rootUser, false, false);
    await this.userDAO.updateFollowCount(userToUnfollow, true, false);

    // TODO: Call the server

    const followCounts = await this.getFollowCounts(token, userToUnfollow);
    return followCounts;
  };
}
