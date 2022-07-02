import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthActionMode, authAction, useUser } from "../src/functions/Firebase";
import UserForm from "../src/components/UserForm";

enum VerifyStatus {
  Loading,
  VerifySuccess,
  ResetWait,
  Error,
}

const AuthPage = () => {
  const router = useRouter();
  const { query } = router;
  const user = useUser();
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>(
    VerifyStatus.Loading
  );

  useEffect(() => {
    if (!query || !query.oobCode || !query.mode) return;
    const queryProcess = async () => {
      console.log(query);
      try {
        if (query.mode === "resetPassword") {
          await authAction(AuthActionMode.ResetPassword, null, query.oobCode);
          setVerifyStatus(VerifyStatus.ResetWait);
        } else if (query.mode === "verifyEmail") {
          await authAction(AuthActionMode.Verify, null, query.oobCode);
          setVerifyStatus(VerifyStatus.VerifySuccess);
        } else setVerifyStatus(VerifyStatus.Error);
      } catch (e) {
        setVerifyStatus(VerifyStatus.Error);
      }
    };
    queryProcess();
  }, [query]);

  return (
    <>
      {verifyStatus === VerifyStatus.Loading ? (
        <UserForm headerText="Loading..." />
      ) : verifyStatus === VerifyStatus.VerifySuccess ? (
        <UserForm
          headerText="Verification done!"
          submit={{
            text: "go to profile",
            action: () => {
              router.push("/profile");
            },
          }}
        />
      ) : verifyStatus === VerifyStatus.ResetWait ? (
        <UserForm
          headerText="Reset password"
          showInputs={{
            email: false,
            username: false,
            password: true,
            password_confirm: true,
          }}
          submit={{
            text: "submit",
            action: AuthActionMode.ResetPassword,
          }}
        />
      ) : (
        <UserForm
          headerText="Authentication error"
          suggestions={[
            {
              text: "The link you used is invalid or has expired. Please try again, or ",
              clickText: "",
              click: AuthActionMode.SignIn,
            },
          ]}
          submit={{
            text: "back to sign in page",
            action: () => {
              router.push("/login");
            },
          }}
        />
      )}
    </>
  );
};

export default AuthPage;
