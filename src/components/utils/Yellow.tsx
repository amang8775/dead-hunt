import { type ReactNode } from "react";

const Yellow = ({ children }: { children: ReactNode }) => {
  return <span className="text-dead-yellow">{children}</span>;
};

export default Yellow;
