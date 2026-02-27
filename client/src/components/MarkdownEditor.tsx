import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useState, useEffect } from "react";
import mermaid from "mermaid";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function MarkdownEditor({ value, onChange, height = "500px" }: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    mermaid.initialize({ startOnLoad: true, theme: "default" });
  }, []);

  useEffect(() => {
    if (mounted && value.includes("```mermaid")) {
      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, [value, mounted]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4" style={{ height }}>
        <div className="border rounded-lg bg-muted animate-pulse"></div>
        <div className="border rounded-lg bg-muted animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4" style={{ height }}>
      {/* Editor Panel - dir="ltr" נדרש כי Monaco Editor לא תומך ב-RTL שמגיע מאלמנט הורה */}
      <div className="border rounded-lg overflow-hidden bg-card" dir="ltr">
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b" dir="rtl">
          עורך Markdown
        </div>
        <Editor
          height={`calc(${height} - 40px)`}
          defaultLanguage="markdown"
          value={value}
          onChange={(val) => onChange(val || "")}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderWhitespace: "selection",
            fontFamily: "Rubik, monospace",
            unicodeHighlight: {
              ambiguousCharacters: false,
            },
            contextmenu: false,
          }}
        />
      </div>

      {/* Preview Panel */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
          תצוגה מקדימה
        </div>
        <div
          className="p-6 overflow-auto prose prose-sm max-w-none"
          style={{ height: `calc(${height} - 40px)` }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              // Custom rendering for better RTL support
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="mr-4">{children}</li>,
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                const isMermaid = className === "language-mermaid";
                
                if (isMermaid) {
                  return (
                    <div className="mermaid my-4">
                      {String(children).replace(/\n$/, "")}
                    </div>
                  );
                }
                
                return isInline ? (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={`${className} block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono`} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <pre className="mb-4">{children}</pre>,
              blockquote: ({ children }) => (
                <blockquote className="border-r-4 border-primary pr-4 py-2 mb-4 text-muted-foreground italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-border bg-muted px-4 py-2 text-right font-bold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2 text-right">
                  {children}
                </td>
              ),
              hr: () => <hr className="my-6 border-border" />,
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
              ),
            }}
          >
            {value || "*כתוב משהו כדי לראות תצוגה מקדימה...*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
