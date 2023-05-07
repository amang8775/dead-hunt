import { type AppType } from "next/app";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignUp,
  RedirectToUserProfile,
} from "@clerk/nextjs";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { useRouter } from "next/router";

const loginPage = "/login/[[...index]]";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  const isLoginPage = loginPage === pathname;

  return (
    <ClerkProvider {...pageProps}>
      {isLoginPage ? (
        <>
          <SignedIn>
            <RedirectToUserProfile />
          </SignedIn>
          <SignedOut>
            <Component {...pageProps} />
          </SignedOut>
        </>
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignUp />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
