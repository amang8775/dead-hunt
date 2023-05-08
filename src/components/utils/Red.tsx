import { type ReactNode } from "react";

const Red = ({ children }: { children: ReactNode }) => {
  return <span className="text-dead-red">{children}</span>;
};

export default Red;
