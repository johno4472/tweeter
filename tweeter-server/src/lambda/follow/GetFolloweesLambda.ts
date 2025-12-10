import {
  PagedUserItemRequest,
  PagedUserItemResponse,
} from "../../../../tweeter-shared/src";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  let userService = new UserService(new DynamoDAOFactory());
  await userService.authenticate(request.token);

  const followService = new FollowService(new DynamoDAOFactory());
  const [items, hasMore] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
