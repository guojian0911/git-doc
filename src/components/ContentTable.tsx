
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
    <div className="border-l border-gray-200 pl-4">
      <h3 className="text-sm font-medium mb-3">在此页面</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.5}rem` }}>
            <a 
              href={`#${item.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentTable;
