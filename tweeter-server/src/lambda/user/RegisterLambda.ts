import { RegisterRequest, UserAuthorizedResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";

export const handler = async (
  request: RegisterRequest
): Promise<UserAuthorizedResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  const [userGot, auth] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user: userGot,
    authToken: { token: auth.token, timestamp: auth.timestamp },
  };
};
