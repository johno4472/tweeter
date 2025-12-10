import { AuthToken } from "../../../tweeter-shared/src";
import {
  AppNavBarPresenter,
  AppNavBarView,
} from "../../src/presenter/AppNavBarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model.service/UserService";

describe("AppNavBarPresenter", () => {
  let mockAppNavBarPresenterView: AppNavBarView;
  let appNavBarPresenter: AppNavBarPresenter;
  let mockService: UserService;

  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockAppNavBarPresenterView = mock<AppNavBarView>();
    const mockAppNavBarPresenterViewInstance = instance(
      mockAppNavBarPresenterView
    );
    when(
      mockAppNavBarPresenterView.displayInfoMessage(anything(), 0)
    ).thenReturn("messageId123");

    const appNavBarPresenterSpy = spy(
      new AppNavBarPresenter(mockAppNavBarPresenterViewInstance)
    );
    appNavBarPresenter = instance(appNavBarPresenterSpy);

    mockService = mock<UserService>();

    when(appNavBarPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(
      mockAppNavBarPresenterView.displayInfoMessage("Logging Out...", 0)
    ).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();

    //additional way to capture and verify parameters
    let [capturedAuthToken] = capture(mockService.logout).last();
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page if successful", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavBarPresenterView.deleteMessage("messageId123")).once();
    verify(mockAppNavBarPresenterView.clearUserInfo()).once();
    verify(mockAppNavBarPresenterView.navigate("/login")).once();
    verify(mockAppNavBarPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccessful", async () => {
    let error = new Error("An error occurred");
    when(mockService.logout(anything())).thenThrow(error);
    await appNavBarPresenter.logOut(authToken);

    verify(
      mockAppNavBarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: ${
          (error as Error).message
        }`
      )
    ).once();
    verify(mockAppNavBarPresenterView.deleteMessage(anything())).never();
    verify(mockAppNavBarPresenterView.clearUserInfo()).never();
    verify(mockAppNavBarPresenterView.navigate("/login")).never();
  });
});
