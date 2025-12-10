import { UserDto } from "tweeter-shared/src";
import { DataPage } from "../../domain/DataPage";

export interface FollowDAO {
  getFollowItems(
    alias: string,
    getFollowers: boolean,
    pageSize: number,
    lastItemAlias: string | null
  ): Promise<DataPage<string>>;

  getIsFollower(user: string, selectedUser: string): Promise<boolean>;

  addFollowItem(rootAlias: string, selectedUser: string): Promise<void>;

  deleteFollowItem(rootAlias: string): Promise<void>;
}
