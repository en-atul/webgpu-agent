import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  content: string;
};

const spacing = {
  p: "mb-4 last:mb-0 leading-relaxed",
  ul: "list-disc pl-6 my-4 space-y-2 [&>li]:my-0",
  ol: "list-decimal pl-6 my-4 space-y-2 [&>li]:my-0",
  li: "pl-1 leading-relaxed",
  strong: "font-semibold text-white",
  h1: "text-xl font-semibold text-white mt-6 mb-3 first:mt-0",
  h2: "text-lg font-semibold text-white mt-5 mb-2",
  h3: "text-base font-semibold text-white mt-4 mb-2",
  pre: "bg-slate-900 border border-slate-700 rounded-lg p-4 my-4 overflow-x-auto",
  code: "text-sky-300",
};

export function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-invert max-w-none text-gray-200 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-lg prose-code:text-sky-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children, ...props }) {
            return (
              <p className={spacing.p} {...props}>
                {children}
              </p>
            );
          },
          ul({ children, ...props }) {
            return (
              <ul className={spacing.ul} {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol className={spacing.ol} {...props}>
                {children}
              </ol>
            );
          },
          li({ children, ...props }) {
            const isEmpty =
              children == null ||
              (typeof children === "string" && children.trim() === "");
            if (isEmpty) return null;
            return (
              <li className={spacing.li} {...props}>
                {children}
              </li>
            );
          },
          strong({ children, ...props }) {
            return (
              <strong className={spacing.strong} {...props}>
                {children}
              </strong>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isBlock = !!match;
            if (isBlock) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const style = oneDark as any;
              return (
                <SyntaxHighlighter
                  style={style}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }
return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

