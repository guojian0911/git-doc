
import React from 'react';

interface ContentTableProps {
  items: {
    id: string;
    text: string;
    level: number;
  }[];
}

const ContentTable = ({ items }: ContentTableProps) => {
  // Create a map to track used IDs and ensure uniqueness
  const uniqueItems = items.reduce<typeof items>((acc, item, index) => {
    // If we've already seen this ID, create a new unique ID by appending the index
    const seenIds = new Set(acc.map(i => i.id));
    let uniqueId = item.id;
    
    if (seenIds.has(uniqueId)) {
      uniqueId = `${item.id}-${index}`;
    }
    
    acc.push({
      ...item,
      id: uniqueId
    });
    
    return acc;
  }, []);

  return (
    <div className="w-full">
      <div className="sticky top-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4 px-4">在此页面</h3>
        <nav className="space-y-0.5">
          {uniqueItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                block text-sm py-2 px-4 rounded-md transition-colors
                ${item.level === 1 ? 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium' : ''}
                ${item.level === 2 ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 pl-6' : ''}
                ${item.level === 3 ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 pl-8' : ''}
                ${item.level > 3 ? 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 pl-10' : ''}
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
