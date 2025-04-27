
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MarkdownRendererProps {
  content: string;
  onHeadingsExtracted?: (headings: { id: string; text: string; level: number }[]) => void;
}

const MarkdownRenderer = ({ content, onHeadingsExtracted }: MarkdownRendererProps) => {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Extract headings for table of contents
  useEffect(() => {
    if (!content) return;

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings: { id: string; text: string; level: number }[] = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = `heading-${extractedHeadings.length}-${text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
      
      extractedHeadings.push({ id, text, level });
    }

    setHeadings(extractedHeadings);
    if (onHeadingsExtracted) {
      onHeadingsExtracted(extractedHeadings);
    }
  }, [content, onHeadingsExtracted]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    
    toast({
      title: "已复制",
      description: "代码已复制到剪贴板",
    });
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <article className="prose prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => {
            const text = (props.children?.[0] as string) || '';
            const id = headings.find(h => h.text === text)?.id || 
                     text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h1 id={id} className="scroll-mt-16 text-3xl font-bold mb-6 mt-8 text-gray-900" {...props} />;
          },
          h2: ({ node, ...props }) => {
            const text = (props.children?.[0] as string) || '';
            const id = headings.find(h => h.text === text)?.id || 
                     text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h2 id={id} className="scroll-mt-16 text-2xl font-semibold mb-4 mt-8 text-gray-900" {...props} />;
          },
          h3: ({ node, ...props }) => {
            const text = (props.children?.[0] as string) || '';
            const id = headings.find(h => h.text === text)?.id || 
                     text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return <h3 id={id} className="scroll-mt-16 text-xl font-semibold mb-3 mt-6 text-gray-900" {...props} />;
          },
          p: ({ node, ...props }) => (
            <p className="text-base leading-relaxed text-gray-700 mb-6" {...props} />
          ),
          pre: ({ node, ...props }) => {
            const code = (props.children as any)[0]?.props?.children?.[0] || '';
            
            return (
              <div className="relative my-6 rounded-lg overflow-hidden">
                <pre className="rounded-md bg-gray-900 p-4 overflow-x-auto text-sm text-white" {...props} />
                <button 
                  className="absolute right-2 top-2 rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20 flex items-center gap-1"
                  onClick={() => handleCopyCode(code)}
                >
                  {copiedCode === code ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>
            );
          },
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !match ? (
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800" {...props}>
                {children}
              </code>
            ) : (
              <code className={cn(className, "text-sm font-mono")} {...props}>
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-8 border rounded-md">
              <table className="border-collapse min-w-full" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-900" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-gray-200 px-4 py-3 text-sm" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-brand-orange hover:underline" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-lg max-w-full my-6 mx-auto shadow-md" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-brand-orange pl-4 italic my-6 text-gray-600" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
