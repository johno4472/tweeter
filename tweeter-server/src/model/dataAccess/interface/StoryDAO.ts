import { StatusDto } from "tweeter-shared/src";
import { DataPage } from "../../domain/DataPage";

export interface StoryDAO {
  getStoryPage(
    alias: string,
    pageSize: number,
    lastStatusTimestamp: number | undefined
  ): Promise<DataPage<StatusDto>>;

  insertStatus(alias: string, status: StatusDto): Promise<void>;
}
