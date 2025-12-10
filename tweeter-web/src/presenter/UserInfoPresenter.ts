import { AuthToken, User } from "../../../tweeter-shared/src";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setFollower(value: boolean): void;
  setFolloweeCount(num: number): void;
  setFollowerCount(num: number): void;
  setLoading(value: boolean): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setFollower(false);
      } else {
        this.view.setFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  public async followAction(
    displayedUser: User,
    followText: string,
    follower: boolean,
    action: () => Promise<[number, number]>
  ) {
    var generalToast = "";
    await this.doFailureReportingOperation(
      async () => {
        this.view.setLoading(true);
        generalToast = this.view.displayInfoMessage(
          `${followText}ing ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await action();

        this.view.setFollower(follower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      `${followText} user`,
      () => {
        this.view.deleteMessage(generalToast);
        this.view.setLoading(false);
      }
    );
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.followAction(displayedUser, "follow", true, async () => {
      return await this.followService.follow(authToken!, displayedUser!);
    });
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.followAction(displayedUser, "unfollow", false, async () => {
      return await this.followService.unfollow(authToken!, displayedUser!);
    });
  }
}
