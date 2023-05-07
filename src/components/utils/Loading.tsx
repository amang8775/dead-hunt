import Image from "next/image";
import { type HTMLAttributes } from "react";

const Loading = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`relative h-[75px] w-[75px] animate-spin ${className ?? ""}`}
    >
      <Image
        src="/icons/loading-green.svg"
        alt="loading"
        fill
        className="relative"
      />
    </div>
  );
};

export default Loading;
