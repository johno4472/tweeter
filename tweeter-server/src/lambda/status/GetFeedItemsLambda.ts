import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "../../../../tweeter-shared/src";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";
import { StatusService } from "../../model/service/StatusService";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  let userService = new UserService(new DynamoDAOFactory());
  userService.authenticate(request.token);

  const statusService = new StatusService(new DynamoDAOFactory());
  const [statuses, areThereMore] = await statusService.loadMoreFeedItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: statuses,
    hasMore: areThereMore,
  };
};
