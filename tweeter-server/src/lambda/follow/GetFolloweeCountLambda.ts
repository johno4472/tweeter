import {
  FollowRequest,
  FollowCountResponse,
} from "../../../../tweeter-shared/src";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: FollowRequest
): Promise<FollowCountResponse> => {
  let userService = new UserService(new DynamoDAOFactory());
  await userService.authenticate(request.token);

  const followService = new FollowService(new DynamoDAOFactory());
  const [numFollowers, numFollowees] = await followService.getFollowCounts(
    request.token,
    request.user.alias
  );

  return {
    success: true,
    message: null,
    count: numFollowees,
  };
};
