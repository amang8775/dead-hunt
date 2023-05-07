import TerminalWrapper from "@/components/Terminal";
import TerminalInput from "@/components/TerminalInput";
import Green from "@/components/utils/Green";
import White from "@/components/utils/White";
import useTerminal from "@/hooks/terminal.hook";
import { useClerk } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";

const Home: NextPage = () => {
  const { signOut } = useClerk();

  const terminalActions = useTerminal({
    initialValue: [
      <div key={0}>
        Help me find my <span className="text-dead-green">mouse</span>!
      </div>,
      "Enter `help` to view list of commands.",
    ],
    showAsError: (item) => <div className="text-dead-error">{item}</div>,
  });

  const {
    terminalItems,
    addTerminalItem,
    addTerminalError,
    addInputItem,
    clearTerminal,
  } = terminalActions;

  const [appState, setAppState] = useState("default");

  const inputRef = useRef<HTMLInputElement>(null);

  const defaultCommandsMap: { [key: string]: () => Promise<void> } = {
    help: async () => {
      addTerminalItem(
        <div>
          Welcome to <White>Dead</White>
          <Green>Hunt</Green>!
          <br />
          List of commands:-
          <br />
          <Green>1-</Green> `<White>help</White>` <Green>-&gt;</Green> Displays
          list of possible commands.
          <br />
          <Green>2-</Green> `<White>clear</White>` <Green>-&gt;</Green> Clears
          the terminal.
          <br />
          <Green>3-</Green> `<White>logout</White>` <Green>-&gt;</Green> Logs
          you out of the app.
        </div>
      );
    },
    clear: async () => {
      clearTerminal();
    },
    "": async () => {},
    logout: async () => {
      await signOut();
    },
  };

  return (
    <>
      <Head>
        <title>DeadHunt</title>
        <meta name="description" content="DeadHunt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TerminalWrapper inputRef={inputRef} terminalItems={terminalItems}>
        <TerminalInput
          inputRef={inputRef}
          terminalActions={terminalActions}
          keyActionMap={{}}
          appState={"default"}
          stateInputTypeMap={{
            default: "text",
          }}
          stateActionMap={{
            default: async (e, value) => {
              addInputItem(value);
              addTerminalItem(value);
              if (!defaultCommandsMap[value]) {
                addTerminalError("Command not found :/ . Use `help`. ");
              } else defaultCommandsMap[value]!();
            },
          }}
        />
      </TerminalWrapper>
    </>
  );
};

export default Home;
