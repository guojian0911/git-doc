
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
    <div className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-100 bg-gray-50/50">
      <ScrollArea className="h-full py-6">
        <div className="px-4 space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 px-2">
                {section.title}
              </h4>
              <nav className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className={cn(
                      "block px-2 py-1.5 text-sm rounded-md transition-colors",
                      location.pathname === link.href
                        ? "text-brand-orange bg-brand-orange/5 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
