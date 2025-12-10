import { Follow, UserDto } from "tweeter-shared/src";
import { FollowDAO } from "../interface/FollowDAO";
import { DynamoClient } from "./DynamoClient";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../../domain/DataPage";

export class DynamoFollowDAO implements FollowDAO {
  private readonly client = DynamoClient.getClient();
  readonly tableName = "follow_data";
  readonly indexName = "follow_data_index";
  readonly followerAttr = "follower_alias";
  readonly followeeAttr = "followee_alias";

  public async getFollowItems(
    alias: string,
    getFollowers: boolean,
    pageSize: number,
    lastItemAlias: string | null
  ): Promise<DataPage<string>> {
    let partitionKey: string;
    let sortKey: string;
    let indexName: string | undefined;

    if (getFollowers) {
      // Use the GSI
      partitionKey = "followee_alias";
      sortKey = "follower_alias";
      indexName = "follow_data_index";
    } else {
      // Main table
      partitionKey = "follower_alias";
      sortKey = "followee_alias";
      indexName = undefined;
    }

    const params = {
      KeyConditionExpression: "#pk = :v",
      ExpressionAttributeNames: {
        "#pk": partitionKey,
      },
      ExpressionAttributeValues: {
        ":v": alias,
      },
      TableName: this.tableName,
      IndexName: indexName,
      Limit: pageSize,
      ExclusiveStartKey: lastItemAlias
        ? {
            [partitionKey]: alias,
            [sortKey]: lastItemAlias,
          }
        : undefined,
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item[sortKey]));
    return new DataPage<string>(items, hasMorePages);
  }

  public async getIsFollower(
    user: string,
    selectedUser: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: { [this.followerAttr]: user, [this.followeeAttr]: selectedUser },
    };
    const output = await this.client.send(new GetCommand(params));
    if (output.Item === undefined) {
      return false;
    } else {
      return true;
    }
  }

  public async addFollowItem(
    rootAlias: string,
    selectedUser: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: rootAlias,
        [this.followeeAttr]: selectedUser,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async deleteFollowItem(rootAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: rootAlias,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
}
