import { UserDto } from "tweeter-shared/src";
import { UserDAO } from "../interface/UserDAO";
import { DynamoClient } from "./DynamoClient";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SecretUserDto } from "../../dto/SecretUserDto";

export class DynamoUserDAO implements UserDAO {
  private readonly client = DynamoClient.getClient();
  readonly tableName = "user";
  readonly aliasAttr = "alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageAttr = "image_url";
  readonly followerAttr = "follower_count";
  readonly followeeAttr = "followee_count";
  readonly passAttr = "password";

  public async getUser(alias: string): Promise<SecretUserDto | null> {
    const params = {
      TableName: this.tableName,
      Key: { [this.aliasAttr]: alias },
    };
    const output = await this.client.send(new GetCommand(params));
    if (output.Item === undefined) {
      return null;
    } else {
      return {
        alias: alias,
        firstName: output.Item[this.firstNameAttr],
        lastName: output.Item[this.lastNameAttr],
        imageUrl: output.Item[this.imageAttr],
        password: output.Item[this.passAttr],
      };
    }
  }

  public async updateFollowCount(
    alias: string,
    changeFollower: boolean,
    increment: boolean
  ): Promise<void> {
    let incrementValue = 1;
    let followItemAttribute = this.followerAttr;

    if (!changeFollower) {
      followItemAttribute = this.followeeAttr;
    }
    if (!increment) {
      incrementValue = -1;
    }

    const params = {
      TableName: this.tableName,
      Key: { [this.aliasAttr]: alias },
      ExpressionAttributeValues: { ":value": incrementValue },
      UpdateExpression:
        "SET " +
        followItemAttribute +
        " = " +
        followItemAttribute +
        " + " +
        ":value",
    };
    await this.client.send(new UpdateCommand(params));
  }

  public async getFollowCount(alias: string): Promise<[number, number]> {
    const params = {
      TableName: this.tableName,
      Key: { [this.aliasAttr]: alias },
    };
    const output = await this.client.send(new GetCommand(params));
    return [
      output.Item?.[this.followerAttr] ?? 0,
      output.Item?.[this.followeeAttr] ?? 0,
    ];
  }

  /*
  alias: alias,
        firstName: output.Item[this.firstNameAttr],
        lastName: output.Item[this.lastNameAttr],
        imageUrl: output.Item[this.imageAttr],
        password: output.Item[this.passAttr],
  */
  public async insertUserData(
    alias: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
    password: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: alias,
        [this.firstNameAttr]: firstName,
        [this.lastNameAttr]: lastName,
        [this.imageAttr]: imageUrl,
        [this.passAttr]: password,
        [this.followerAttr]: 0,
        [this.followeeAttr]: 0,
      },
    };
    await this.client.send(new PutCommand(params));
  }
}
