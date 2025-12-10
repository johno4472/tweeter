import {
  IsFollowerResponse,
  IsFollowerRequest,
} from "../../../../tweeter-shared/src";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  let userService = new UserService(new DynamoDAOFactory());
  userService.authenticate(request.token);

  const followService = new FollowService(new DynamoDAOFactory());
  const followerOrNot = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower: followerOrNot,
  };
};
