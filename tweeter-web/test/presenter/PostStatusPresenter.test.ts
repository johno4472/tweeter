import { AuthToken, Status, User } from "../../../tweeter-shared/src";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("AppNavBarPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;
  let testUser = new User("first", "last", "alias", "url");
  let statusString = "post";

  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123"
    );

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();

    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(statusString, testUser, authToken);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(statusString, testUser, authToken);
    let [newAuthToken, status] = capture(mockService.postStatus).last();
    expect((status as Status).post).toEqual(statusString);
    verify(mockService.postStatus(authToken, anything())).once();
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(statusString, testUser, authToken);
    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", anything())
    ).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    let error = new Error("An error occurred");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);
    await postStatusPresenter.submitPost(statusString, testUser, authToken);

    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: ${
          (error as Error).message
        }`
      )
    ).once();
    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", anything())
    ).never();
  });
});
