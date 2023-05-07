import { type ReactNode } from "react";

const Green = ({ children }: { children: ReactNode }) => {
  return <span className="text-dead-green">{children}</span>;
};

export default Green;
