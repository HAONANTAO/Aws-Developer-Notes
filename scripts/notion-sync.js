import fs from 'fs';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

// 递归获取块和所有子块
async function fetchBlocksRecursive(blockId) {
  let allBlocks = [];

  async function fetchChildren(id) {
    let blocks = [];
    let cursor = undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: id,
        start_cursor: cursor,
      });

      if (!response.results) {
        throw new Error('Notion API 返回结果中没有 results');
      }

      blocks = blocks.concat(response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);

    return blocks;
  }

  async function recursiveFetch(id) {
    const blocks = await fetchChildren(id);
    for (const block of blocks) {
      allBlocks.push(block);

      // 有子块的类型，继续递归
      if (
        block.has_children &&
        ['toggle', 'child_page', 'child_database', 'synced_block'].includes(block.type)
      ) {
        await recursiveFetch(block.id);
      }
      // 还有一些block类型也可能有子块，比如 'bulleted_list_item' 等，你也可以扩展
    }
  }

  await recursiveFetch(blockId);

  return allBlocks;
}

// 提取文本内容，简单示例，可根据需要扩展
function extractTextFromBlocks(blocks) {
  let content = '';

  for (const block of blocks) {
    if (!block || typeof block.type !== 'string') continue;

    switch (block.type) {
      case 'paragraph':
        content += block.paragraph.text.map(t => t.plain_text).join('') + '\n\n';
        break;
      case 'heading_1':
        content += '# ' + block.heading_1.text.map(t => t.plain_text).join('') + '\n\n';
        break;
      case 'heading_2':
        content += '## ' + block.heading_2.text.map(t => t.plain_text).join('') + '\n\n';
        break;
      case 'heading_3':
        content += '### ' + block.heading_3.text.map(t => t.plain_text).join('') + '\n\n';
        break;
      case 'bulleted_list_item':
        content += '- ' + block.bulleted_list_item.text.map(t => t.plain_text).join('') + '\n';
        break;
      case 'numbered_list_item':
        content += '1. ' + block.numbered_list_item.text.map(t => t.plain_text).join('') + '\n';
        break;
      case 'toggle':
        content += '> ' + block.toggle.text.map(t => t.plain_text).join('') + '\n\n';
        break;
      // 可继续支持更多类型
      default:
        break;
    }
  }

  return content;
}

async function main() {
  if (!pageId || !process.env.NOTION_TOKEN) {
    console.error('请确保设置了 NOTION_TOKEN 和 NOTION_PAGE_ID 环境变量');
    process.exit(1);
  }

  try {
    const blocks = await fetchBlocksRecursive(pageId);
    const markdown = extractTextFromBlocks(blocks);
    fs.writeFileSync('NOTION_SYNC.md', markdown, 'utf8');
    console.log('同步完成，内容已写入 NOTION_SYNC.md');
  } catch (err) {
    console.error('同步失败:', err);
    process.exit(1);
  }
}

main();
