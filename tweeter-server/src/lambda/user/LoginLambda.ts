import { LoginRequest, UserAuthorizedResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dataAccess/dynamoDAO/DynamoDAOFactory";

export const handler = async (
  request: LoginRequest
): Promise<UserAuthorizedResponse> => {
  const userService = new UserService(new DynamoDAOFactory());

  const [userGot, auth] = await userService.login(
    request.alias,
    request.password
  );

  return {
    success: true,
    message: null,
    user: userGot,
    authToken: {
      token: auth.token,
      timestamp: auth.timestamp,
    },
  };
};
