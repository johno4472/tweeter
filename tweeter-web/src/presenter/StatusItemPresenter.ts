import { Status } from "../../../tweeter-shared/src";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model.service/StatusService";

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected serviceFactory(): StatusService {
    return new StatusService();
  }
}
