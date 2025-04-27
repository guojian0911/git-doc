
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLocation } from 'react-router-dom';

interface SidebarLink {
  title: string;
  href: string;
  indentation?: number;
}

const Sidebar = () => {
  const location = useLocation();
  
  const sections = [
    {
      title: "快速开始",
      links: [
        { title: "介绍", href: "/" },
        { title: "快速上手", href: "/quickstart" },
        { title: "安装指南", href: "/installation" },
      ]
    },
    {
      title: "基础教程",
      links: [
        { title: "基本概念", href: "/basics" },
        { title: "使用教程", href: "/tutorials" },
        { title: "最佳实践", href: "/best-practices" },
      ]
    }
  ];

  return (
    <div className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <ScrollArea className="h-full py-8">
        <div className="px-3 space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                {section.title}
              </h4>
              <nav className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className={cn(
                      "block px-3 py-2 text-sm rounded-md transition-colors",
                      location.pathname === link.href
                        ? "text-brand-orange bg-orange-50 dark:bg-orange-900/10 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {link.title}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
