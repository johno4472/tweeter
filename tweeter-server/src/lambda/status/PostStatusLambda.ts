import { StatusService } from "../../model/service/StatusService";
import { PostStatusRequest, TweeterResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  let userService = new UserService(new DynamoDAOFactory());
  let rootUser = await userService.authenticate(request.token);
  // if (request.token == null || request.token == undefined) {
  //   throw new Error("There ain't no auth token yall");
  // }
  // let rootUser = await userService.authenticate(request.token);
  // if (rootUser == null || rootUser == undefined) {
  //   throw new Error("Invalid auth token");
  // }

  const statusService = new StatusService(new DynamoDAOFactory());
  await statusService.postStatus(rootUser, request.token, request.newStatus);

  return {
    success: true,
    message: null,
  };
};
