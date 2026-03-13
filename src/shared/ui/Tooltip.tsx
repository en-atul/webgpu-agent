import { useState } from "react";

type Props = {
  content: string;
  children: React.ReactNode;
  placement?: "top" | "bottom";
};

export function Tooltip({ content, children, placement = "top" }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={`absolute left-1/2 -translate-x-1/2 z-50 flex flex-col items-center ${
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {placement === "bottom" && (
            <span className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-neutral-800" />
          )}
          <span className="px-3 py-2 text-xs text-gray-100 bg-neutral-800 border border-white/10 rounded-lg shadow-2xl min-w-[200px] max-w-[280px] text-left whitespace-normal">
            {content}
          </span>
          {placement === "top" && (
            <span className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-neutral-800 -mt-px" />
          )}
        </span>
      )}
    </span>
  );
}
