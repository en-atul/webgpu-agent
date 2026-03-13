import { type ComponentPropsWithoutRef, forwardRef } from "react";

const wrapperClasses =
  "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-violet-500/40 focus-within:bg-white/10";
const inputClasses =
  "w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none";
const inputClassesUnwrapped =
  "flex-1 min-w-0 bg-transparent text-sm text-white placeholder-gray-500 outline-none";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  unwrapped?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    unwrapped = false,
    wrapperClassName = "",
    inputClassName = "",
    className,
    ...props
  },
  ref,
) {
  if (unwrapped) {
    return (
      <input
        ref={ref}
        className={`${inputClassesUnwrapped} ${inputClassName} ${className ?? ""}`.trim()}
        {...props}
      />
    );
  }

  return (
    <div className={`${wrapperClasses} ${wrapperClassName}`.trim()}>
      <input
        ref={ref}
        className={`${inputClasses} ${inputClassName} ${className ?? ""}`.trim()}
        {...props}
      />
    </div>
  );
});
