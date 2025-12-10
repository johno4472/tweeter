import { GetUserRequest, UserResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";

export const handler = async (
  request: GetUserRequest
): Promise<UserResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  userService.authenticate(request.token);

  const userGot = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: null,
    user: userGot,
  };
};
