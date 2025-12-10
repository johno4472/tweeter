import { AuthToken, Status, User, UserDto } from "../../../tweeter-shared/src";
import "isomorphic-fetch";
import { StatusService } from "../../../src/model.service/StatusService";

describe("StatusService", () => {
  let statusService = new StatusService();

  it("returns a user's story pages", async () => {
    let authToken: AuthToken = AuthToken.Generate();
    let userAlias: string = "testAlias";
    let pageSize = 10;
    let lastItemFirst: Status | null = null;

    const [stories, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItemFirst
    );

    expect(stories).not.toBeNull();
    expect(stories[0]).toBeInstanceOf(Status);
    expect(stories[0].post).not.toBeNull();
    expect(stories.length).toBe(10);
    expect(hasMore).toBeTruthy();
  });
});
