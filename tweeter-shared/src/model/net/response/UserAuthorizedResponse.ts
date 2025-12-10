import { AuthToken } from "../../domain/AuthToken";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserResponse } from "./UserResponse";

export interface UserAuthorizedResponse extends UserResponse {
  authToken: AuthTokenDto;
}
