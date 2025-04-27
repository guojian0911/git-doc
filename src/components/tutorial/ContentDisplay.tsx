
import React, { Suspense } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import LoadingState from './LoadingState';

interface ContentDisplayProps {
  content: string;
  onHeadingsExtracted: (headings: { id: string; text: string; level: number }[]) => void;
}

const ContentDisplay = ({ content, onHeadingsExtracted }: ContentDisplayProps) => (
  <div className="max-w-4xl mx-auto">
    <Suspense fallback={<LoadingState />}>
      <MarkdownRenderer 
        content={content} 
        onHeadingsExtracted={onHeadingsExtracted}
      />
    </Suspense>
  </div>
);

export default ContentDisplay;

