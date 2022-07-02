import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore/lite";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  User,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};
const app = initializeApp(firebaseConfig);

const Database = getFirestore(app);
const Auth = getAuth(app);

enum AuthActionMode {
  SignIn,
  SignUp,
  SignOut,
  SendVerify,
  Verify,
  SendResetPassword,
  ResetPassword,
  ChangeUsername,
}

enum AuthStatus {
  Loading,
  NotUser,
  NotVerified,
  LoggedIn,
}

const authErrorHandler = (errorCode: string) => {
  return errorCode.split("/")[1].replace(/-/g, " ");
};

const signIn = async (form: HTMLFormElement | null) => {
  const email = form?.email.value;
  const password = form?.password.value;
  if (!email) return Promise.reject("email is required");
  if (!password) return Promise.reject("password is required");
  try {
    await signInWithEmailAndPassword(Auth, email, password);
    return Promise.resolve("successfully signed in!");
  } catch (e: any) {
    return Promise.reject(authErrorHandler(e.code));
  }
};

const signUp = async (form: HTMLFormElement | null) => {
  const email = form?.email.value;
  const username = form?.username.value;
  const password = form?.password.value;
  const password_confirm = form?.password_confirm.value;
  if (!email) return Promise.reject("email is required");
  if (!username) return Promise.reject("username is required");
  if (!password || !password_confirm)
    return Promise.reject("password is required");
  if (password != password_confirm)
    return Promise.reject("passwords do not match");
  try {
    const user = await createUserWithEmailAndPassword(Auth, email, password);
    await updateProfile(user.user, { displayName: username });
    await sendEmailVerification(user.user);
    return Promise.resolve("successfully signed up!");
  } catch (e: any) {
    return Promise.reject(authErrorHandler(e.code));
  }
};

const logOut = async () => {
  try {
    await signOut(Auth);
    return Promise.resolve("successfully signed out!");
  } catch (e: any) {
    return Promise.reject(authErrorHandler(e.code));
  }
};

const sendVerify = async () => {
  if (Auth.currentUser)
    try {
      await sendEmailVerification(Auth.currentUser);
      return Promise.resolve("verification sent!");
    } catch (e: any) {
      return Promise.reject(authErrorHandler(e.code));
    }
  else return Promise.reject("no user logged in");
};

const verifyUser = async (token: string | undefined | string[]) => {
  if (token)
    try {
      await applyActionCode(Auth, token.toString());
      return Promise.resolve("successfully verified!");
    } catch (e: any) {
      return Promise.reject(authErrorHandler(e.code));
    }
  else return Promise.reject("no token provided");
};

const SendResetPassword = async (form: HTMLFormElement | null) => {
  const email = form?.email.value;
  if (!email) return Promise.reject("email is required");
  try {
    await sendPasswordResetEmail(Auth, email);
    return Promise.resolve("password recovery link sent!");
  } catch (e: any) {
    return Promise.reject(authErrorHandler(e.code));
  }
};

const resetPassword = async (
  form: HTMLFormElement | null,
  token: string | undefined | string[]
) => {
  if (token) {
    token = token.toString();
    await verifyPasswordResetCode(Auth, token).catch((e) =>
      Promise.reject("invalid link, please request a reset link again.")
    );
    const new_password = form?.password.value;
    const new_password_confirm = form?.password_confirm.value;
    if (!new_password || !new_password_confirm)
      return Promise.reject("password is required");
    if (new_password != new_password_confirm)
      return Promise.reject("passwords do not match");
    try {
      await confirmPasswordReset(Auth, token, new_password);
      return Promise.resolve("password reset!");
    } catch (e: any) {
      return Promise.reject(authErrorHandler(e.code));
    }
  } else return Promise.reject("no token provided");
};

const authAction = async (
  authMode: AuthActionMode,
  form: HTMLFormElement | null,
  token: string | undefined | string[]
): Promise<string> => {
  switch (authMode) {
    case AuthActionMode.SignIn:
      return signIn(form);
    case AuthActionMode.SignUp:
      return signUp(form);
    case AuthActionMode.SignOut:
      return logOut();
    case AuthActionMode.SendVerify:
      return sendVerify();
    case AuthActionMode.Verify:
      return verifyUser(token);
    case AuthActionMode.SendResetPassword:
      return SendResetPassword(form);
    case AuthActionMode.ResetPassword:
      return resetPassword(form, token);
    default:
      return Promise.reject("invalid auth mode");
  }
};

const useUser = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    Auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);
  return user;
};

const useAuthStatus = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Loading);
  const user = useUser();
  useEffect(() => {
    if (user === undefined) return;
    if (user) {
      if (user.emailVerified) setAuthStatus(AuthStatus.LoggedIn);
      else setAuthStatus(AuthStatus.NotVerified);
    } else setAuthStatus(AuthStatus.NotUser);
  }, [user]);
  return authStatus;
};

const getData = async (collection: string, document: string) => {
  const data = await getDoc(doc(Database, collection, document));
  return data.data();
};

export {
  Database,
  Auth,
  AuthActionMode,
  AuthStatus,
  authAction,
  useUser,
  useAuthStatus,
  getData,
};
