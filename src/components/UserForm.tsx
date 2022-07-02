import { useState, useRef, ReactElement } from "react";
import { authAction, AuthActionMode } from "../functions/Firebase";

interface UserFormProps {
  headerText?: string;
  showInputs?: {
    email: boolean;
    username: boolean;
    password: boolean;
    password_confirm: boolean;
  };
  suggestions?: {
    text: string;
    clickText?: string;
    click?: AuthActionMode | (() => void);
  }[];
  submit?: {
    text: string;
    action: AuthActionMode | (() => void);
  };
  childProps?: ReactElement;
}

const UserForm = (props: UserFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [warningText, setWarningText] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [freeze, setFreeze] = useState<boolean>(false);

  const submitManager = async (authActionMode: AuthActionMode | null) => {
    if (freeze) return;
    if (authActionMode !== null) {
      setFreeze(true);
      await authAction(authActionMode, formRef.current, undefined)
        .then((res) => {
          setResponseText(res);
          setWarningText("");
        })
        .catch((error) => {
          setResponseText("");
          setWarningText(error);
          setFreeze(false);
        });
    }
  };

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-slate-900 dark:text-white text-center text-3xl font-extrabold">
              {props.headerText === undefined
                ? "Loading ..."
                : props.headerText}
            </h2>
          </div>
          {props.childProps}
          <form
            className="mt-8 space-y-6"
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              if (props.submit) {
                if (typeof props.submit.action === "function")
                  props.submit.action();
                else submitManager(props.submit.action);
              }
            }}
          >
            {props.showInputs ? (
              <div className="rounded-md border-2 border-slate-500 shadow-sm -space-y-px">
                {props.showInputs?.email ? (
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full p-3 bg-transparent placeholder-slate-500 focus:outline-none"
                      placeholder="Email address"
                    />
                    {props.showInputs.username ||
                    props.showInputs.password ||
                    props.showInputs.password_confirm ? (
                      <hr className="border border-slate-500" />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {props.showInputs?.username ? (
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none block w-full p-3 bg-transparent placeholder-slate-500 focus:outline-none"
                      placeholder="Username"
                    />
                    {props.showInputs.password ||
                    props.showInputs.password_confirm ? (
                      <hr className="border border-slate-500" />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {props.showInputs?.password ? (
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full p-3 bg-transparent placeholder-gray-500 focus:outline-none"
                      placeholder="Password"
                    />
                    {props.showInputs.password_confirm ? (
                      <hr className="border border-slate-500" />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {props.showInputs?.password_confirm ? (
                  <div>
                    <label htmlFor="password_confirm" className="sr-only">
                      Confirm password
                    </label>
                    <input
                      id="password"
                      name="password_confirm"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full p-3 bg-transparent placeholder-gray-500 focus:outline-none"
                      placeholder="Confirm password"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
            <div className={responseText ? "block" : "hidden"}>
              <p className="text-sm rounded-md border border-green-900 p-4 bg-green-300">
                {responseText}
              </p>
            </div>
            <div className={warningText ? "block" : "hidden"}>
              <p className="text-sm rounded-md border border-red-900 p-4 bg-red-300">
                {warningText}
              </p>
            </div>
            <div className="">
              {props.suggestions ? (
                props.suggestions.map((suggestion, index) => {
                  return (
                    <div key={index}>
                      {suggestion.text}
                      <a
                        href="#"
                        className="font-medium text-emerald-400 hover:text-emerald-600 transition-colors duration-300"
                        onClick={() => {
                          if (!suggestion.click) return;
                          if (typeof suggestion.click === "function")
                            suggestion.click();
                          else submitManager(suggestion.click);
                        }}
                      >
                        {suggestion.clickText}
                      </a>
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            <div>
              {props.headerText === undefined ? (
                <></>
              ) : (
                <button
                  type="submit"
                  disabled={freeze}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-slate-700 hover:text-slate-100 bg-emerald-400 hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray"
                >
                  {props.submit?.text}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserForm;
