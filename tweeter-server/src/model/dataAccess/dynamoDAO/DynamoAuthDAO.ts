import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthDAO } from "../interface/AuthDAO";
import { DynamoClient } from "./DynamoClient";
import { SessionInfo } from "../../domain/SessionInfo";
import { time } from "console";
import { ExpressionType } from "@aws-sdk/client-s3";

export class DynamoAuthDAO implements AuthDAO {
  private readonly client = DynamoClient.getClient();
  readonly tableName = "session";
  readonly authAttr = "token";
  readonly aliasAttr = "user_alias";
  readonly timeAttr = "time_stamp";

  public async getAuthData(userToken: string): Promise<SessionInfo | null> {
    const params = {
      TableName: this.tableName,
      Key: { [this.authAttr]: userToken },
    };
    const output = await this.client.send(new GetCommand(params));
    if (output.Item === undefined) {
      return null;
    } else {
      return {
        token: userToken,
        userAlias: output.Item[this.aliasAttr],
        timeStamp: output.Item[this.timeAttr],
      };
    }
  }

  public async insertAuthData(
    userToken: string,
    userAlias: string,
    time_stamp: number
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.authAttr]: userToken,
        [this.aliasAttr]: userAlias,
        [this.timeAttr]: time_stamp,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async deleteAuthData(userToken: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.authAttr]: userToken },
    };
    await this.client.send(new DeleteCommand(params));
  }

  public async updateTimestamp(token: string): Promise<void> {
    let time_Stamp = Date.now();

    const params = {
      TableName: this.tableName,
      Key: { [this.authAttr]: token },
      ExpressionAttributeValues: { ":time": time_Stamp },
      UpdateExpression: "SET " + this.timeAttr + " = " + ":time",
    };
    await this.client.send(new UpdateCommand(params));
  }
}
