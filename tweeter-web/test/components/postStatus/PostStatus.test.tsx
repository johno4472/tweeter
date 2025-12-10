import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "../../../tweeter-shared/src";
library.add(fab);

// "../../src/components/userInfo/UserInfoHooks"
jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  let testUser = new User("first", "last", "alias", "url");
  let testAuthToken = new AuthToken("token", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: testUser,
      authToken: testAuthToken,
    });
  });
  it("starts with the postStatus and clear buttons disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when text fields have input", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "text");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when text field cleared", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "text");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with correct parameters when the post status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const postText = "text";
    const { postButton, textField, user } = renderPostStatusAndGetElements(
      mockPresenterInstance
    );

    await user.type(textField, postText);

    await user.click(postButton);

    verify(mockPresenter.submitPost(postText, testUser, testAuthToken)).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByLabelText("textField");

  return { user, postButton, clearButton, textField };
}
