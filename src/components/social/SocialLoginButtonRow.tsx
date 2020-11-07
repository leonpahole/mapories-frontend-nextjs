import React from "react";
import {
  ReactFacebookFailureResponse,
  ReactFacebookLoginInfo,
} from "react-facebook-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { FaFacebook, FaFacebookF, FaTwitter } from "react-icons/fa";
import TwitterLogin from "react-twitter-auth";
import { SocialProvider, loginSocial } from "../../api/auth.api";
import { UserExcerpt } from "../../types/UserExcerpt";
import { SocialProviderData } from "../../types/LoginSocialResponse";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { createSocialAccountAction } from "../../redux/createSocialAccount/createSocialAccount.actions";

interface TwitterAccessTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
}

interface SocialLoginButtonRowProps {
  onLogin(user: UserExcerpt): void;
}

const SocialLoginButtonRow: React.FC<SocialLoginButtonRowProps> = ({
  onLogin,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onRedirectToCreateAccountPage = (
    providerData: SocialProviderData,
    provider: SocialProvider,
    accessToken: string,
    accessTokenSecret?: string
  ) => {
    dispatch(
      createSocialAccountAction({
        provider,
        accessToken,
        accessTokenSecret,
        providerData,
      })
    );

    history.push("/create-social-account");
  };

  const doLoginSocial = async (
    accessToken: string,
    provider: SocialProvider,
    accessTokenSecret?: string
  ): Promise<boolean> => {
    const loginSocialResponse = await loginSocial(
      accessToken,
      provider,
      accessTokenSecret
    );

    if (loginSocialResponse.existingUser) {
      onLogin(loginSocialResponse.existingUser);
    } else if (loginSocialResponse.nonExistingUser) {
      onRedirectToCreateAccountPage(
        loginSocialResponse.nonExistingUser,
        provider,
        accessToken,
        accessTokenSecret
      );
    } else {
      return false;
    }

    return true;
  };

  const responseFacebook = async (
    response: ReactFacebookLoginInfo | ReactFacebookFailureResponse
  ) => {
    try {
      if ("accessToken" in response) {
        const success = await doLoginSocial(response.accessToken, "facebook");
        if (success) {
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }

    alert("Failed to login using FB!");
  };

  const responseGoogle = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    try {
      if ("accessToken" in response) {
        const success = await doLoginSocial(response.accessToken, "google");
        if (success) {
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }

    alert("Failed to login using Google!");
  };

  const responseGoogleFailure = (error: any) => {
    console.log(error);
    alert("Failed to login using Google!");
  };

  const responseTwitter = async (res: any) => {
    const response: TwitterAccessTokenResponse = await res.json();
    try {
      const success = await doLoginSocial(
        response.oauth_token,
        "twitter",
        response.oauth_token_secret
      );
      if (success) {
        return;
      }
    } catch (e) {
      console.log(e);
    }

    alert("Failed to login using Google!");
  };

  const responseTwitterFailure = (error: any) => {
    alert(error);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <FacebookLogin
        appId="383763399303065"
        fields="name,email,picture"
        scope="public_profile,email"
        callback={responseFacebook}
        icon={<FaFacebook />}
        textButton="Sign in with Facebook"
        render={(renderProps: any) => (
          <div
            className="social-btn-div fb-btn-div"
            onClick={renderProps.onClick}
          >
            <FaFacebookF className="social-btn-icon fb-btn-icon" />
          </div>
        )}
      />

      <GoogleLogin
        clientId="1009429077754-bcbmqavs1t5c3vv2ea0jdeqfhg007i93.apps.googleusercontent.com"
        render={(renderProps: any) => (
          <div
            className="social-btn-div  google-btn-div"
            onClick={renderProps.onClick}
          >
            <svg
              className="social-btn-icon google-btn-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="48px"
              height="48px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
          </div>
        )}
        onSuccess={responseGoogle}
        onFailure={responseGoogleFailure}
      />

      <TwitterLogin
        loginUrl="http://localhost:4000/auth/twitter/access_token"
        onSuccess={responseTwitter}
        onFailure={responseTwitterFailure}
        requestTokenUrl="http://localhost:4000/auth/twitter/request_token"
        style={{
          padding: "unset",
          background: "transparent",
          border: "unset",
        }}
      >
        <div className="social-btn-div twitter-btn-div">
          <FaTwitter className="social-btn-icon twitter-btn-icon" />
        </div>
      </TwitterLogin>
    </div>
  );
};

export default SocialLoginButtonRow;
