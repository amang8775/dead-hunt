import { type TerminalActions } from "@/hooks/terminal.hook";
import {
  type KeyboardEventHandler,
  type KeyboardEvent,
  type RefObject,
  type HTMLInputTypeAttribute,
} from "react";

interface TerminalInputProps {
  inputRef: RefObject<HTMLInputElement>;
  terminalActions: TerminalActions;
  stateActionMap: {
    [key: string]: (
      e: KeyboardEvent<HTMLInputElement>,
      value: string
    ) => Promise<void>;
  };
  stateInputTypeMap: {
    [key: string]: HTMLInputTypeAttribute;
  };
  keyActionMap: {
    [key: string]: (e: KeyboardEvent<HTMLInputElement>) => Promise<void>;
  };
  appState: string;
}

const TerminalInput = ({
  inputRef,
  terminalActions,
  stateActionMap,
  stateInputTypeMap,
  keyActionMap,
  appState,
}: TerminalInputProps) => {
  const { setInputItemIndex, inputItems } = terminalActions;

  const appStates = Object.keys(stateActionMap);
  const keyStates = Object.keys(keyActionMap);

  return (
    <input
      ref={inputRef}
      autoFocus={true}
      onKeyDown={async (e) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const newIndex = Math.max(inputItems.index - 1, 0);
          e.currentTarget.value = inputItems.inputs[newIndex] ?? "";
          setInputItemIndex(newIndex);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const newIndex = Math.min(
            inputItems.index + 1,
            inputItems.inputs.length
          );
          e.currentTarget.value = inputItems.inputs[newIndex] ?? "";
          setInputItemIndex(newIndex);
        } else if (e.key === "Enter") {
          if (appStates.includes(appState)) {
            const value = e.currentTarget.value;
            e.currentTarget.value = "";
            await stateActionMap[appState]!(e, value);
          }
        } else if (keyStates.includes(e.key)) {
          await keyActionMap[e.key]!(e);
        }
      }}
      type={stateInputTypeMap[appState]}
      style={{ caretShape: "underscore" }}
      className="text-dead-white-more"
    />
  );
};

export default TerminalInput;
