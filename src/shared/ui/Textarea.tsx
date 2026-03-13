import { type ComponentPropsWithoutRef, forwardRef } from "react";

const wrapperClasses =
  "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-violet-500/40 focus-within:bg-white/10";
const textareaClasses =
  "w-full resize-y bg-transparent text-sm text-white placeholder-gray-500 outline-none";

export type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  wrapperClassName?: string;
  textareaClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      wrapperClassName = "",
      textareaClassName = "",
      className,
      ...props
    },
    ref,
  ) {
    return (
      <div className={`${wrapperClasses} ${wrapperClassName}`.trim()}>
        <textarea
          ref={ref}
          className={`${textareaClasses} ${textareaClassName} ${className ?? ""}`.trim()}
          {...props}
        />
      </div>
    );
  },
);
