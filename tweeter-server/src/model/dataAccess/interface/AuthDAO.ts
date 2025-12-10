import { AuthToken } from "tweeter-shared/src";
import { SessionInfo } from "../../domain/SessionInfo";

export interface AuthDAO {
  //get authData returns user alias and number
  getAuthData(token: string): Promise<SessionInfo | null>;

  //add authData
  insertAuthData(
    token: string,
    userAlias: string,
    timestamp: number /*TODO not sure if this is the right dataType*/
  ): Promise<void>;

  //delete authData
  deleteAuthData(token: string): Promise<void>;

  updateTimestamp(token: string): Promise<void>;
}
