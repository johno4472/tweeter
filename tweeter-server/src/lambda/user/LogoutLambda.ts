import { LogoutRequest, TweeterResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  let userService = new UserService(new DynamoDAOFactory());
  userService.authenticate(request.token);

  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
