import {
  AuthToken,
  FollowActionResponse,
  FollowCountResponse,
  FollowRequest,
  GetUserRequest,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  TweeterResponse,
  User,
  UserAuthorizedResponse,
  UserResponse,
} from "../../../tweeter-shared/src";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://v9pykrzjv6.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/followees/get");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/followers/get");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollower(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/get");

    // Handle errors
    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFollowerCount(request: FollowRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowCountResponse
    >(request, "/follow/followers/count/get");

    // Handle errors
    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(request: FollowRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowCountResponse
    >(request, "/follow/followers/count/get");

    // Handle errors
    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async follow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowActionResponse
    >(request, "/follow/post");

    // Handle errors
    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async unfollow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowActionResponse
    >(request, "/follow/delete");

    // Handle errors
    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/feed/get");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (request.lastItem == null) {
      console.log("Last item is null");
    }
    console.log(response.hasMore + " <--- hasMore?\n" + response.items);
    console.log("User here" + request.lastItem?.user.firstName);
    console.log("Request: " + request);
    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    console.log("WE GONNA GET MORE STORY ITEMS! for " + request.userAlias);
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/story/get");
    console.log("STORY ITEMS HAS MORE?" + response.hasMore);
    console.log("STORY ITEMS EXIST? " + response.items?.length);
    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (items != null) {
      return [items, response.hasMore];
    } else {
      return [[], response.hasMore];
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    console.log("REQUEST TOKEN: " + request.token);

    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post");

    // Handle errors
    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      UserResponse
    >(request, "/user/get");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const newUser = User.fromDto(response.user);

    // Handle errors
    if (response.success) {
      return newUser;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      UserAuthorizedResponse
    >(request, "/user/put");

    console.log("AUTHTOKEN IN SERVER FACADE: " + response.authToken.token);
    const newUser = User.fromDto(response.user);

    // Handle errors
    if (response.success) {
      if (newUser == null) {
        throw new Error(`No user found`);
      } else {
        const authToken = new AuthToken(
          response.authToken.token,
          response.authToken.timestamp
        );
        return [newUser, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/user/delete");

    // Handle errors
    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      UserAuthorizedResponse
    >(request, "/user/post");
    console.log("REQUEST: " + request);
    // Convert the UserDto array returned by ClientCommunicator to a User array
    const newUser: User | null = User.fromDto(response.user);

    // Handle errors
    if (response.success) {
      if (newUser == null) {
        throw new Error(`No followees found`);
      } else {
        return [newUser, response.authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
}
