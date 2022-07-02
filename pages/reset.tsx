import { AuthActionMode } from "../src/functions/Firebase";
import UserForm from "../src/components/UserForm";

const ResetPage = () => {
  return (
    <UserForm
      headerText={"Reset password"}
      showInputs={{
        email: true,
        username: false,
        password: false,
        password_confirm: false,
      }}
      suggestions={[
        {
          text: "Please put your email address above, we will send a recovery link to your email.",
          clickText: "",
          click: AuthActionMode.SendResetPassword,
        },
      ]}
      submit={{
        text: "get a recovery link",
        action: AuthActionMode.SendResetPassword,
      }}
    />
  );
};

export default ResetPage;
