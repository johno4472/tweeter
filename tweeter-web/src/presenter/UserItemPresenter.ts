import { User } from "../../../tweeter-shared/src";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { FollowService } from "../model.service/FollowService";

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected serviceFactory(): FollowService {
    return new FollowService();
  }
}
