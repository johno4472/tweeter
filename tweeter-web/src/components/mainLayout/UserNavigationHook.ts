import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserNavigatePresenter } from "../../presenter/UserNavigatePresenter";
import { useRef } from "react";

export const useNavigateToUser = () => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const navigate = useNavigate();

  const presenterRef = useRef<UserNavigatePresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = new UserNavigatePresenter();
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    const featurePath = event.target.toString();
    let page = featurePath.split("/")[3];
    try {
      const alias = presenterRef.current!.extractAlias(event.target.toString());
      const toUser = await presenterRef.current!.getUser(authToken!, alias);
      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`/${page}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return navigateToUser;
};
