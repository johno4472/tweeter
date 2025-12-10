import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoClient {
  private static client: DynamoDBClient | null = null;

  public static getClient(): DynamoDBClient {
    if (DynamoClient.client == null) {
      DynamoClient.client = DynamoDBDocumentClient.from(
        new DynamoDBClient({ region: "us-east-1" })
      );
    }
    return DynamoClient.client;
  }
}
