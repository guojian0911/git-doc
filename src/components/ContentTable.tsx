
import React from 'react';

interface ContentTableProps {
  items: {
    id: string;
    text: string;
    level: number;
  }[];
}

const ContentTable = ({ items }: ContentTableProps) => {
  return (
    <div className="w-full">
      <div className="sticky top-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">在此页面</h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                block text-sm py-1.5 transition-colors
                ${item.level === 1 ? 'text-gray-900 hover:text-brand-orange font-medium' : ''}
                ${item.level === 2 ? 'text-gray-600 hover:text-gray-900 pl-3' : ''}
                ${item.level === 3 ? 'text-gray-500 hover:text-gray-700 pl-6' : ''}
                ${item.level > 3 ? 'text-gray-400 hover:text-gray-600 pl-9' : ''}
              `}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ContentTable;
