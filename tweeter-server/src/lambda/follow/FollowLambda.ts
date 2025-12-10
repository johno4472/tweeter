import {
  FollowRequest,
  FollowActionResponse,
} from "../../../../tweeter-shared/src";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: FollowRequest
): Promise<FollowActionResponse> => {
  let userService = new UserService(new DynamoDAOFactory());
  let rootUser = await userService.authenticate(request.token);

  const followService = new FollowService(new DynamoDAOFactory());
  const [numFollowers, numFollowees] = await followService.follow(
    rootUser,
    request.token,
    request.user.alias
  );

  return {
    success: true,
    message: null,
    followerCount: numFollowers,
    followeeCount: numFollowees,
  };
};
