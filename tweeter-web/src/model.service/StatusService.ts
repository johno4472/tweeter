import { AuthToken, Status } from "../../../tweeter-shared/src";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItemFirst: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    let token = authToken.token;
    let lastItem = lastItemFirst?.dto ?? null;
    return await this.serverFacade.getMoreFeedItems({
      token,
      userAlias,
      pageSize,
      lastItem,
    });
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItemFirst: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    let token = authToken.token;
    let lastItem = lastItemFirst?.dto ?? null;
    return await this.serverFacade.getMoreStoryItems({
      token,
      userAlias,
      pageSize,
      lastItem,
    });
  }

  public async postStatus(
    authToken: AuthToken,
    statusFirst: Status
  ): Promise<void> {
    let token = authToken.token;
    let newStatus = statusFirst?.dto ?? null;
    return await this.serverFacade.postStatus({ token, newStatus });
  }
}
