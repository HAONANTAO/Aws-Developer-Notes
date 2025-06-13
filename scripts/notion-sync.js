import fs from 'fs';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

// 递归获取所有子 block
async function fetchAllBlocks(blockId) {
  const blocks = [];

  async function recurse(block_id) {
    let cursor;
    do {
      const res = await notion.blocks.children.list({
        block_id,
        start_cursor: cursor,
      });

      if (!res.results) throw new Error('Notion API 返回结果中没有 results');

      for (const block of res.results) {
        if (!block) continue;
        if (block.has_children) {
          block.children = await recurse(block.id);
        }
        blocks.push(block);
      }

      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);

    return blocks;
  }

  return recurse(blockId);
}

// 渲染 Markdown
function renderMarkdown(blocks, depth = 0) {
  let md = '';
  const indent = '  '.repeat(depth);

  for (const block of blocks) {
    const getText = (richText = []) => richText.map(t => t.plain_text).join('');

    switch (block.type) {
      case 'paragraph':
        md += `${indent}${getText(block.paragraph.rich_text)}\n\n`;
        break;
      case 'heading_1':
        md += `${indent}# ${getText(block.heading_1.rich_text)}\n\n`;
        break;
      case 'heading_2':
        md += `${indent}## ${getText(block.heading_2.rich_text)}\n\n`;
        break;
      case 'heading_3':
        md += `${indent}### ${getText(block.heading_3.rich_text)}\n\n`;
        break;
      case 'bulleted_list_item':
        md += `${indent}- ${getText(block.bulleted_list_item.rich_text)}\n`;
        break;
      case 'numbered_list_item':
        md += `${indent}1. ${getText(block.numbered_list_item.rich_text)}\n`;
        break;
      case 'toggle':
        md += `${indent}<details><summary>${getText(block.toggle.rich_text)}</summary>\n\n`;
        if (block.children) {
          md += renderMarkdown(block.children, depth + 1);
        }
        md += `\n${indent}</details>\n\n`;
        break;
      case 'to_do':
        const checked = block.to_do.checked ? '☑️' : '⬜️';
        md += `${indent}${checked} ${getText(block.to_do.rich_text)}\n`;
        break;
      case 'quote':
        md += `${indent}> ${getText(block.quote.rich_text)}\n\n`;
        break;
      case 'code':
        md += `${indent}\`\`\`${block.code.language}\n${getText(block.code.rich_text)}\n\`\`\`\n\n`;
        break;
      case 'callout':
        md += `${indent}> 💡 ${getText(block.callout.rich_text)}\n\n`;
        break;
      default:
        // 如果你要支持更多 block 类型，可以在这里扩展
        break;
    }

    // 递归渲染子内容（除 toggle 外，toggle 已递归处理）
    if (block.children && block.type !== 'toggle') {
      md += renderMarkdown(block.children, depth + 1);
    }
  }

  return md;
}

// 主函数入口
async function main() {
  if (!pageId || !process.env.NOTION_TOKEN) {
    console.error('请设置 NOTION_TOKEN 和 NOTION_PAGE_ID 环境变量');
    process.exit(1);
  }

  try {
    const blocks = await fetchAllBlocks(pageId);
    const markdown = renderMarkdown(blocks).trim();

    if (!markdown) {
      console.warn('⚠️ 页面没有可写入的文本内容');
    }

    fs.writeFileSync('NOTION_SYNC.md', markdown || '# 页面为空\n', 'utf8');
    console.log('✅ Notion 同步成功，内容已写入 NOTION_SYNC.md');
  } catch (err) {
    console.error('❌ 同步失败:', err.message);
    process.exit(1);
  }
}

main();
