
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarLink {
  title: string;
  href: string;
  indentation?: number;
}

interface SidebarSectionProps {
  title: string;
  links: SidebarLink[];
}

const SidebarSection = ({ title, links }: SidebarSectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="mb-2 px-4 text-sm font-semibold text-gray-500">{title}</h3>
      <div>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className={cn(
              "block border-l-2 px-4 py-2 text-sm transition-colors hover:bg-gray-100",
              link.href === window.location.pathname
                ? "border-brand-orange bg-orange-50 text-brand-orange font-medium"
                : "border-transparent text-gray-700",
              link.indentation && `pl-${4 + link.indentation * 2}`
            )}
          >
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const sections: SidebarSectionProps[] = [
    {
      title: "入门",
      links: [
        { title: "快速开始", href: "/" },
        { title: "安装", href: "/installation" },
        { title: "基本用法", href: "/basic-usage" },
        { title: "显示示例", href: "/examples" },
      ],
    },
    {
      title: "功能",
      links: [
        { title: "Markdown 语法", href: "/markdown-syntax" },
        { title: "代码高亮", href: "/code-highlighting" },
        { title: "表格", href: "/tables" },
        { title: "图表", href: "/charts" },
      ],
    },
    {
      title: "进阶",
      links: [
        { title: "自定义主题", href: "/custom-themes" },
        { title: "插件系统", href: "/plugins" },
        { title: "API 参考", href: "/api-reference" },
      ],
    },
  ];

  return (
    <div className="hidden lg:block h-full w-64 border-r border-gray-200 bg-white">
      <ScrollArea className="h-full py-4">
        {sections.map((section, index) => (
          <SidebarSection key={index} {...section} />
        ))}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
