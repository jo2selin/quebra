import React, { ReactNode } from "react";

type InfoProps = {
  type: string;
  children: ReactNode;
  className?: string;
};

function Info({ type, children, className }: InfoProps) {
  const [isOpen, setIsopen] = React.useState(true);
  return (
    <div
      className={`relative mx-5 rounded-xl border-2 ${
        isOpen && "border-4 border-b-[40px]"
      } 
      ${type === "info" && "border-jam-purple"}
      ${type === "alert" && "border-jam-alert"}
       bg-jam-dark-purple p-2 pl-3 ${className}`}
    >
      <h5 className={`text-3xl ${!isOpen && "text-base"}`}>{type}</h5>
      <div
        className={`font-mono text-sm lowercase transition-all ${
          !isOpen && "h-0 opacity-0"
        }`}
      >
        {children}
      </div>
      <div
        className={`absolute bottom-0  flex w-full cursor-pointer  justify-end ${
          isOpen ? " translate-y-8" : "-translate-y-2"
        } `}
        onClick={() => setIsopen(!isOpen)}
      >
        <svg
          className={`mr-5 h-6 w-6 text-gray-800 transition-transform dark:text-white ${
            !isOpen && "rotate-180"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m5 15 7-7 7 7"
          />
        </svg>
      </div>
    </div>
  );
}

export default Info;
