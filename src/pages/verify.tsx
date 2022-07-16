import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthActionMode, useUser } from "../src/functions/Firebase";
import UserForm from "../src/components/UserForm";

const VerifyPage = () => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) router.push("/login");
    else if (user.emailVerified) router.push("/profile");
  }, [user]);

  return (
    <>
      {user === undefined ? (
        <UserForm headerText="Loading..." />
      ) : (
        <UserForm
          headerText={"Verification needed"}
          suggestions={[
            {
              text: `You need to verify your email (${user?.email}) by clicking into the link we sent to your email. If you did not receive the email, you can `,
              clickText: "click here to get a new one.",
              click: AuthActionMode.SendVerify,
            },
          ]}
          submit={{
            text: "sign out",
            action: AuthActionMode.SignOut,
          }}
        />
      )}
    </>
  );
};

export default VerifyPage;
