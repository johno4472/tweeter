import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../../presenter/loginPresenter";
import { User, AuthToken } from "../../../../../tweeter-shared/src";
import { AuthenticationView } from "../../../presenter/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const listener: AuthenticationView = {
    setIsLoading: function (value: boolean): void {
      setIsLoading(value);
    },
    updateUserInfo: function (
      user: User,
      user1: User,
      authToken: AuthToken,
      rememberMe: boolean
    ): void {
      updateUserInfo(user, user1, authToken, rememberMe);
    },
    navigate: function (value: string): void {
      navigate(value);
    },
    displayErrorMessage: function (value: string): void {
      displayErrorMessage(value);
    },
  };

  const presenterRef = useRef<LoginPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = props.presenter ?? new LoginPresenter(listener);
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = () => {
    presenterRef.current!.doLogin(
      alias,
      password,
      props.originalUrl,
      rememberMe
    );
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          loginOrRegisterOnEnter={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
