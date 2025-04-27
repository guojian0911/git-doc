
export const markdownContent = `
# MdDocs 入门指南

MdDocs 是一个强大的文档可视化工具，专为展示 Markdown 文件而设计。它简洁易用，支持丰富的 Markdown 语法，并且提供了代码高亮、表格和其他增强功能。

## 快速开始

在你的项目目录中运行以下命令：

\`\`\`bash
npm install mddocs
\`\`\`

就这么简单！你现在可以在当前目录中找到一个 \`mddocs-output.json\` 文件，其中包含了 AI 友好格式的整理好的文档。

## 基础用法

创建一个新的 Markdown 文件，然后使用以下语法：

\`\`\`jsx
import { MarkdownRenderer } from 'mddocs';

function App() {
  return <MarkdownRenderer source="./my-documentation.md" />;
}
\`\`\`

然后，你可以将此组件添加到你的应用程序中，就可以看到格式化后的文档了。

## 支持的功能

MdDocs 支持多种 Markdown 功能：

### 列表

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项
  - 另一个嵌套项
- 无序列表项 3

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

### 代码块

\`\`\`typescript
// 这是一个 TypeScript 代码示例
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);  // 输出: Hello, World!
\`\`\`

### 表格

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| source | string | - | Markdown 源文件路径 |
| theme | string | 'default' | 主题名称 |
| plugins | Plugin[] | [] | 要使用的插件列表 |

### 引用块

> 这是一个引用块。引用块可以包含多行文本，并且被视为单个段落。
>
> 这是引用块的第二段。

## 自定义主题

MdDocs 支持自定义主题。您可以创建自己的主题或使用预定义主题：

\`\`\`jsx
<MarkdownRenderer source="./docs.md" theme="github" />
\`\`\`

## 高级用法

### 插件系统

MdDocs 有一个强大的插件系统，可以扩展其功能：

\`\`\`jsx
import { MarkdownRenderer } from 'mddocs';
import chartPlugin from 'mddocs-chart-plugin';
import mathPlugin from 'mddocs-math-plugin';

function App() {
  return (
    <MarkdownRenderer 
      source="./advanced-docs.md" 
      plugins={[chartPlugin(), mathPlugin()]}
    />
  );
}
\`\`\`

### API 参考

查看我们的 [API 参考文档](/api-reference) 获取完整的 API 详情。

---

感谢使用 MdDocs! 如果您有任何问题，请查看我们的 [社区论坛](https://mddocs.community) 或提交 [GitHub issue](https://github.com/mddocs/mddocs/issues)。
`;
