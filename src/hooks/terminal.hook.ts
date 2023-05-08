import { type TerminalItem } from "@/types/terminal";
import { useState } from "react";

interface useTerminalProps {
  initialValue: TerminalItem[];
  showAsError: (item: TerminalItem) => TerminalItem;
}

export interface TerminalActions {
  terminalItems: TerminalItem[];
  inputItems: {
    inputs: string[];
    index: number;
  };
  addTerminalItem: (item: TerminalItem) => void;
  clearTerminal: () => void;
  addTerminalError: (item: TerminalItem) => void;
  addInputItem: (item: string) => void;
  setInputItemIndex: (index: number) => void;
}

const useTerminal = ({
  initialValue,
  showAsError,
}: useTerminalProps): TerminalActions => {
  const [terminalItems, setTerminalItems] =
    useState<TerminalItem[]>(initialValue);

  const [inputItems, setInputItems] = useState<{
    inputs: string[];
    index: number;
  }>({ index: 0, inputs: [] });

  const addTerminalItem = (item: TerminalItem) => {
    setTerminalItems((t) => [...t, item]);
  };
  const clearTerminal = () => {
    setTerminalItems([]);
  };

  const addTerminalError = (item: TerminalItem) => {
    setTerminalItems((t) => [...t, showAsError(item)]);
  };

  const addInputItem = (item: string) => {
    setInputItems((_) => ({
      index: _.inputs.length + 1,
      inputs: [..._.inputs, item],
    }));
  };
  const setInputItemIndex = (index: number) => {
    setInputItems((_) => ({
      index,
      inputs: _.inputs,
    }));
  };

  return {
    terminalItems,
    inputItems,
    addTerminalItem,
    clearTerminal,
    addTerminalError,
    addInputItem,
    setInputItemIndex,
  };
};

export default useTerminal;
