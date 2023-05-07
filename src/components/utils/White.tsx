import { type ReactNode } from "react";

const White = ({ children }: { children: ReactNode }) => {
  return <span className="text-dead-white-more">{children}</span>;
};

export default White;
