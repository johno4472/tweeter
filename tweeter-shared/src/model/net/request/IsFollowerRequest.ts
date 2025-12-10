import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerRequest extends TweeterRequest {
  token: string;
  user: UserDto;
  selectedUser: UserDto;
}
