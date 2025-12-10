import { StatusDto } from "tweeter-shared/src";
import { DataPage } from "../../domain/DataPage";

export interface FeedDAO {
  getFeedPage(
    alias: string,
    pageSize: number,
    lastStatusTimestamp: number | null
  ): Promise<DataPage<StatusDto>>;

  insertStatus(alias: string, status: StatusDto): void;
}
