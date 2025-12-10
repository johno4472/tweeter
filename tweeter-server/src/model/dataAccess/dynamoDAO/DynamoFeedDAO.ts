import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Status, StatusDto } from "tweeter-shared/src";
import { DynamoClient } from "./DynamoClient";
import { FeedDAO } from "../interface/FeedDAO";
import { DataPage } from "../../domain/DataPage";

export class DynamoFeedDao implements FeedDAO {
  private readonly client = DynamoClient.getClient();
  readonly tableName = "feed";
  readonly indexName = "feed_index";
  readonly rootAttr = "root_alias";
  readonly postAttr = "post";
  readonly timeAttr = "time_stamp";
  readonly aliasAttr = "user_alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageAttr = "image_url";

  public async getFeedPage(
    alias: string,
    pageSize: number,
    lastStatusTimestamp: number | null
  ): Promise<DataPage<StatusDto>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "#root = :v", // only partition key needed for all items
      ExpressionAttributeNames: {
        "#root": this.rootAttr,
      },
      ExpressionAttributeValues: {
        ":v": alias,
      },
      Limit: pageSize,
      ScanIndexForward: false, // newest first
      ExclusiveStartKey: lastStatusTimestamp
        ? {
            [this.rootAttr]: alias, // partition key
            [this.timeAttr]: lastStatusTimestamp, // sort key
          }
        : undefined,
    };
    const items: StatusDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push({
        post: item[this.postAttr],
        user: {
          alias: item[this.aliasAttr],
          firstName: item[this.firstNameAttr],
          lastName: item[this.lastNameAttr],
          imageUrl: item[this.imageAttr],
        },
        timestamp: item[this.timeAttr],
      })
    );
    return new DataPage<StatusDto>(items, hasMorePages);
  }

  public async insertStatus(alias: string, status: StatusDto): Promise<void> {
    status.timestamp = Date.now();
    const params = {
      TableName: this.tableName,
      Item: {
        [this.rootAttr]: alias,
        [this.postAttr]: status.post,
        [this.aliasAttr]: status.user.alias,
        [this.firstNameAttr]: status.user.firstName,
        [this.lastNameAttr]: status.user.lastName,
        [this.imageAttr]: status.user.imageUrl,
        [this.timeAttr]: status.timestamp,
      },
    };
    await this.client.send(new PutCommand(params));
  }
}
