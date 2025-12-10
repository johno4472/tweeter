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
  const [stories, areThereMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  console.log(stories.length);
  return {
    success: true,
    message: null,
    items: stories,
    hasMore: areThereMore,
  };
};
