
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { markdownContent } from '@/data/markdown-content';

const Index = () => {
  const [tableOfContents, setTableOfContents] = useState<{ id: string; text: string; level: number }[]>([]);

  const handleHeadingsExtracted = (headings: { id: string; text: string; level: number }[]) => {
    setTableOfContents(headings);
  };

  return (
    <MainLayout tableOfContents={tableOfContents}>
      <MarkdownRenderer 
        content={markdownContent} 
        onHeadingsExtracted={handleHeadingsExtracted} 
      />
    </MainLayout>
  );
};

export default Index;
