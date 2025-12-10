import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface UserResponse extends TweeterResponse {
  user: UserDto | null;
}
