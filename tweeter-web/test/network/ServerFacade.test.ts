import { User, UserDto } from "../../../tweeter-shared/src";
import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("ServerFacade", () => {
  let serverFacade = new ServerFacade();

  it("registers successfully", async () => {
    let firstName: string = "test";
    let lastName: string = "test";
    let userImageBytes: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
    let imageFileExtension: string = "testPath.png";
    let alias: string = "testAlias";
    let password: string = "testPass";

    const [user, auth] = await serverFacade.register({
      alias,
      password,
      firstName,
      lastName,
      userImageBytes,
      imageFileExtension,
    });
    expect(user).not.toBeNull();
    expect(user.firstName).toBe("Allen");
    expect(auth.token).not.toBeNull();
  });

  it("gets followers successfully", async () => {
    let token: string = "token";
    let userAlias: string = "alias";
    let pageSize: number = 10;
    let lastItem: UserDto | null = null;
    const [users, hasMore] = await serverFacade.getMoreFollowers({
      token,
      userAlias,
      pageSize,
      lastItem,
    });

    expect(users).not.toBeNull();
    expect(users.length).toBe(10);
    expect(hasMore).toBeTruthy();
    expect(users[0]).toBeInstanceOf(User);
  });

  it("gets follower count successfully", async () => {
    let firstName: string = "test";
    let lastName: string = "test";
    let alias: string = "testAlias";
    let imageUrl: string = "testPath.png";

    let token: string = "token";
    let user: UserDto = {
      firstName,
      lastName,
      imageUrl,
      alias,
    };

    const followerCount = await serverFacade.getFollowerCount({ token, user });

    expect(followerCount).not.toBeNaN();
    expect(typeof followerCount).toBe("number");
  });
});
