import { Status, StatusDto } from "tweeter-shared/src";
import { Service } from "./Service";
import { FeedDAO } from "../dataAccess/interface/FeedDAO";
import { StoryDAO } from "../dataAccess/interface/StoryDAO";
import { FollowDAO } from "../dataAccess/interface/FollowDAO";
import { DAOFactory } from "../dataAccess/interface/DAOFactory";
import { DataPage } from "../domain/DataPage";

export class StatusService implements Service {
  readonly feedDAO: FeedDAO;
  readonly storyDAO: StoryDAO;
  readonly followDAO: FollowDAO;

  public constructor(factory: DAOFactory) {
    this.feedDAO = factory.getFeedDAO();
    this.storyDAO = factory.getStoryDAO();
    this.followDAO = factory.getFollowDAO();
  }

  loadMoreFeedItems = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    return await this.loadMoreItems(async () => {
      return this.feedDAO.getFeedPage(
        userAlias,
        pageSize,
        lastItem?.timestamp ?? null
      );
    });
  };

  loadMoreStoryItems = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    return await this.loadMoreItems(async () => {
      return this.storyDAO.getStoryPage(
        userAlias,
        pageSize,
        lastItem?.timestamp
      );
    });
  };

  public async loadMoreItems(
    operation: () => Promise<DataPage<StatusDto>>
  ): Promise<[StatusDto[], boolean]> {
    let statusData = await operation();

    let statusInfo: StatusDto[] = [];
    statusData.values.forEach((value) => {
      statusInfo.push({
        post: value.post,
        user: value.user,
        timestamp: value.timestamp,
      });
    });

    return [statusInfo, statusData.hasMorePages];
  }

  public async postStatus(
    alias: string,
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    let hasMore = true;
    let followees: string[] = [];
    while (hasMore) {
      let followerData: DataPage<string> = await this.followDAO.getFollowItems(
        alias,
        true,
        10,
        null
      );
      followerData.values.forEach((value) => {
        followees.push(value);
      });
      hasMore = followerData.hasMorePages;
    }

    await Promise.all(
      followees.map((value) => this.feedDAO.insertStatus(value, newStatus))
    );

    await this.storyDAO.insertStatus(alias, newStatus);
  }
}
