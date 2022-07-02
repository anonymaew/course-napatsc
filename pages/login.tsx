import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AuthActionMode,
  authAction,
  useUser,
  useAuthStatus,
  AuthStatus,
} from "../src/functions/Firebase";
import UserForm from "../src/components/UserForm";

enum AuthPage {
  SignIn,
  SignUp,
}

const Login = () => {
  const router = useRouter();
  const [authPage, setAuthPage] = useState<AuthPage>(AuthPage.SignIn);
  const authStatus = useAuthStatus();
  const user = useUser();

  useEffect(() => {
    if (user) {
      if (!user.emailVerified) router.push("/verify");
      else router.push("/profile");
    }
  }, [user]);

  return (
    <>
      {authStatus === AuthStatus.Loading ? (
        <UserForm headerText="Loading..." />
      ) : authPage == AuthPage.SignIn ? (
        <UserForm
          headerText={"Sign in"}
          showInputs={{
            email: true,
            username: false,
            password: true,
            password_confirm: false,
          }}
          suggestions={[
            {
              text: "Forget password? ",
              clickText: "reset password here.",
              click: () => {
                router.push("/reset");
              },
            },
            {
              text: "If you do not have your account, ",
              clickText: "sign up here.",
              click: () => {
                setAuthPage(AuthPage.SignUp);
              },
            },
          ]}
          submit={{
            text: "sign in",
            action: AuthActionMode.SignIn,
          }}
        />
      ) : (
        <UserForm
          headerText={"Sign up"}
          showInputs={{
            email: true,
            username: true,
            password: true,
            password_confirm: true,
          }}
          suggestions={[
            {
              text: "If you already have your account, ",
              clickText: "sign in here.",
              click: () => {
                setAuthPage(AuthPage.SignIn);
              },
            },
          ]}
          submit={{
            text: "create account",
            action: AuthActionMode.SignUp,
          }}
        />
      )}
    </>
  );
};

export default Login;
