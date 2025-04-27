
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  onHeadingsExtracted?: (headings: { id: string; text: string; level: number }[]) => void;
}

const MarkdownRenderer = ({ content, onHeadingsExtracted }: MarkdownRendererProps) => {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  // Extract headings for table of contents
  useEffect(() => {
    if (!content) return;

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings: { id: string; text: string; level: number }[] = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      extractedHeadings.push({ id, text, level });
    }

    setHeadings(extractedHeadings);
    if (onHeadingsExtracted) {
      onHeadingsExtracted(extractedHeadings);
    }
  }, [content, onHeadingsExtracted]);

  return (
    <article className="prose prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => {
            const id = (props.children?.[0] as string)?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h1 id={id} className="scroll-mt-16" {...props} />;
          },
          h2: ({ node, ...props }) => {
            const id = (props.children?.[0] as string)?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h2 id={id} className="scroll-mt-16" {...props} />;
          },
          h3: ({ node, ...props }) => {
            const id = (props.children?.[0] as string)?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h3 id={id} className="scroll-mt-16" {...props} />;
          },
          pre: ({ node, ...props }) => (
            <div className="relative">
              <pre className="rounded-md bg-gray-900 p-4 overflow-x-auto text-sm text-white" {...props} />
              <button 
                className="absolute right-2 top-2 rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                onClick={() => {
                  const code = (props.children as any)[0].props.children[0];
                  navigator.clipboard.writeText(code);
                }}
              >
                复制
              </button>
            </div>
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !match ? (
              <code className="rounded bg-gray-200 px-1 py-0.5 text-sm" {...props}>
                {children}
              </code>
            ) : (
              <code className={cn(className, "text-sm")} {...props}>
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-300" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
