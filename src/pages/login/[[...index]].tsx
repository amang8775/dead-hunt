import TerminalWrapper from "@/components/Terminal";
import TerminalInput from "@/components/TerminalInput";
import Loading from "@/components/utils/Loading";
import useTerminal from "@/hooks/terminal.hook";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();

  const terminalActions = useTerminal({
    initialValue: [
      <div key={0}>
        Help me find my <span className="text-dead-green">mouse</span>!
      </div>,
      "Login continue...",
      "Enter your email...",
    ],
    showAsError: (item) => <div className="text-dead-error">{item}</div>,
  });

  const { terminalItems, addTerminalItem, addTerminalError, addInputItem } =
    terminalActions;

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValues, setInputValues] = useState<{
    emailAddress?: string;
    password?: string;
    code?: string;
  }>({});

  const [appState, setAppState] = useState<"email" | "pass" | "code">("email");

  if (!isSignInLoaded || !isSignUpLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  const handleLogin = async ({
    emailAddress,
    password,
    code,
    action,
  }: {
    emailAddress: string;
    password: string;
    code?: string;
    action: "send-code" | "verify-code";
  }) => {
    try {
      if (action === "send-code") {
        let flow: "sign-in" | "sign-up" = "sign-up";
        try {
          await signUp.create({
            emailAddress,
            password,
          });
        } catch (error) {
          if (!(error as any)?.errors[0]?.code) throw error;
          const errorCode = (error as any).errors[0].code as string;
          if (errorCode !== "form_identifier_exists") throw error;
          try {
            flow = "sign-in";
            await signIn.create({
              identifier: emailAddress,
              password,
            });

            if (signIn.status === "complete") {
              addTerminalItem("Loading...");
              await setActive({ session: signIn.createdSessionId });
              return { continue: false, redirect: true };
            } else {
              throw signIn.status;
            }
          } catch (error) {
            throw error;
          }
        }

        if (flow === "sign-up") await signUp.prepareEmailAddressVerification();
      } else if (action === "verify-code") {
        if (!code) return { continue: false, redirect: false };
        await signUp.attemptEmailAddressVerification({
          code,
        });
        if (signUp.status === "complete") {
          addTerminalItem("Loading...");
          await setActive({ session: signUp.createdSessionId });
          return { continue: false, redirect: true };
        } else {
          throw signUp.status;
        }
      }

      return { continue: true, redirect: false };
    } catch (error) {
      addTerminalError((error as any).errors[0].longMessage);
      addTerminalItem("Enter your email...");
      setAppState("email");
      return { continue: false, redirect: false };
    }
  };

  return (
    <>
      <Head>
        <title>DeadHunt - Sign Up</title>
        <meta name="description" content="DeadHunt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TerminalWrapper inputRef={inputRef} terminalItems={terminalItems}>
        <TerminalInput
          inputRef={inputRef}
          terminalActions={terminalActions}
          keyActionMap={{}}
          appState={appState}
          stateInputTypeMap={{
            email: "email",
            code: "text",
            pass: "password",
          }}
          stateActionMap={{
            email: async (e, value) => {
              addInputItem(value);
              setInputValues((_) => ({ ..._, emailAddress: value }));
              addTerminalItem(value);
              addTerminalItem("Enter your password!");
              setAppState("pass");
            },
            pass: async (e, value) => {
              const response = await handleLogin({
                emailAddress: inputValues.emailAddress!,
                password: value,
                action: "send-code",
              });
              if (response.continue) {
                setInputValues((_) => ({ ..._, password: value }));
                addTerminalItem("Check your mail & enter the code!");
                setAppState("code");
              } else if (response.redirect) {
                router.reload();
              }
            },
            code: async (e, value) => {
              addInputItem(value);
              addTerminalItem(value);
              addTerminalItem(
                <div>
                  Creating a new account with emailAddress:{" "}
                  {inputValues.emailAddress!}
                </div>
              );
              const response = await handleLogin({
                emailAddress: inputValues.emailAddress!,
                password: inputValues.password!,
                code: value,
                action: "verify-code",
              });
              if (response.redirect) {
                router.reload();
              }
            },
          }}
        />
      </TerminalWrapper>
    </>
  );
};

export default LoginPage;
