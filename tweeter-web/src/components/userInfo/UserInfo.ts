import { User, AuthToken } from "../../../../tweeter-shared/src";

export interface UserInfo {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
}
