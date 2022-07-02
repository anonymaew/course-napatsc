import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser, AuthActionMode } from "../src/functions/Firebase";
import UserForm from "../src/components/UserForm";

const ProfilePage = () => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) router.push("/login");
    else if (!user.emailVerified) router.push("/verify");
  }, [user]);

  return (
    <>
      {user === undefined ? (
        <UserForm headerText="Loading..." />
      ) : (
        <UserForm
          headerText={"Your profile"}
          suggestions={[
            {
              text: "",
              clickText: "Reset password",
              click: () => {
                router.push("/reset");
              },
            },
          ]}
          submit={{
            text: "sign out",
            action: AuthActionMode.SignOut,
          }}
          childProps={
            <div className="">
              <dl>
                <div className="border-y border-grey px-4 py-5 grid grid-cols-3">
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="text-gray-900 col-span-2">
                    {user ? user.email : ""}
                  </dd>
                </div>
                <div className="px-4 py-5 grid grid-cols-3">
                  <dt className="font-medium text-gray-500">Username</dt>
                  <dd className="text-gray-900 col-span-2">
                    {user ? user.displayName : ""}
                  </dd>
                </div>
                <div className="border-y border-grey px-4 py-5 grid grid-cols-3">
                  <dt className="font-medium text-gray-500">User ID</dt>
                  <dd className="text-gray-900 text-sm font-mono col-span-2">
                    {user ? user.uid : ""}
                  </dd>
                </div>
              </dl>
            </div>
          }
        />
      )}
    </>
  );
};

export default ProfilePage;
