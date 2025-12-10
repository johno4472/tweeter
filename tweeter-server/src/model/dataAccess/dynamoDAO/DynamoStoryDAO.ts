import { StatusDto } from "tweeter-shared/src";
import { StoryDAO } from "../interface/StoryDAO";
import { DynamoClient } from "./DynamoClient";
import { DataPage } from "../../domain/DataPage";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoStoryDAO implements StoryDAO {
  private readonly client = DynamoClient.getClient();
  readonly tableName = "story";
  readonly indexName = "story_index";
  readonly rootAttr = "root_alias";
  readonly postAttr = "post";
  readonly timeAttr = "time_stamp";
  readonly aliasAttr = "user_alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageAttr = "image_url";

  async getStoryPage(
    alias: string,
    pageSize: number,
    lastStatusTimestamp: number | undefined
  ): Promise<DataPage<StatusDto>> {
    const params = {
      KeyConditionExpression: this.rootAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastStatusTimestamp === undefined
          ? undefined
          : {
              [this.rootAttr]: alias,
              [this.timeAttr]: lastStatusTimestamp,
            },
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
