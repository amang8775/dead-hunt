import { type TerminalItem } from "@/types/terminal";
import { type ReactNode, type RefObject } from "react";

interface TerminalWrapperProps {
  children: ReactNode;
  terminalItems: TerminalItem[];
  inputRef: RefObject<HTMLInputElement>;
}

const TerminalWrapper = ({
  children,
  inputRef,
  terminalItems,
}: TerminalWrapperProps) => {
  return (
    <>
      <main
        className="h-screen w-screen overflow-y-auto p-8"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!inputRef.current) return;
          inputRef.current.focus();
        }}
      >
        {terminalItems.map((ti, i) => {
          return (
            <div key={i} className=" flex items-start gap-4">
              <span className="text-xl text-dead-white-more">&gt;</span>
              <div className="mt-1">{ti}</div>
            </div>
          );
        })}
        <div className="flex items-end gap-4">
          <span className="text-xl text-dead-green">&gt;</span>
          {children}
        </div>
      </main>
    </>
  );
};

export default TerminalWrapper;
