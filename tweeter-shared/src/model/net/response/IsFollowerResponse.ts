import { TweeterResponse } from "./TweeterResponse";

export interface IsFollowerResponse extends TweeterResponse {
  isFollower: boolean;
}
