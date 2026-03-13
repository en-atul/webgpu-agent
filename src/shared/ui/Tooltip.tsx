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
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              className="block -mb-px"
            >
              <path
                d="M0 8 L7 0 L14 8"
                fill="#050505"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </svg>
          )}
          <span className="px-3 py-2 text-xs text-gray-100 bg-[#050505] border border-white/10 rounded-lg shadow-2xl min-w-[200px] max-w-[280px] text-left whitespace-normal">
            {content}
          </span>
          {placement === "top" && (
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              className="block -mt-px"
            >
              <path
                d="M0 0 L7 8 L14 0"
                fill="#050505"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </svg>
          )}
        </span>
      )}
    </span>
  );
}
