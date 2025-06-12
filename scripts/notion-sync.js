import fs from 'fs';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
let pageId = process.env.NOTION_PAGE_ID;

if (!pageId) {
  console.error('请设置环境变量 NOTION_PAGE_ID');
  process.exit(1);
}

function normalizeId(id) {
  return id.replace(/-/g, '');
}

pageId = normalizeId(pageId);

async function fetchAllBlocks(blockId) {
  let blocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    if (!response || !Array.isArray(response.results)) {
      throw new Error('Notion API 返回结果中没有 results');
    }

    for (const block of response.results) {
      blocks.push(block);
      if (block.has_children) {
        const childBlocks = await fetchAllBlocks(block.id);
        blocks = blocks.concat(childBlocks);
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

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
      case 'toggle':
        // toggle前面加>表示引用
        content += '> ' + block.toggle.text.map(t => t.plain_text).join('') + '\n\n';
        break;
      case 'bulleted_list_item':
        content += '- ' + block.bulleted_list_item.text.map(t => t.plain_text).join('') + '\n';
        break;
      case 'numbered_list_item':
        content += '1. ' + block.numbered_list_item.text.map(t => t.plain_text).join('') + '\n';
        break;
      case 'code':
        content += '```\n' + block.code.text.map(t => t.plain_text).join('') + '\n```\n\n';
        break;
      // 更多类型可继续加...
      default:
        // console.log('未处理的块类型:', block.type);
        break;
    }
  }

  return content;
}

async function main() {
  if (!process.env.NOTION_TOKEN) {
    console.error('请确保设置了环境变量 NOTION_TOKEN');
    process.exit(1);
  }

  try {
    const blocks = await fetchAllBlocks(pageId);
    if (blocks.length === 0) {
      console.warn('⚠️ 页面没有可写入的文本内容');
    }
    const markdown = extractTextFromBlocks(blocks);
    fs.writeFileSync('NOTION_SYNC.md', markdown, 'utf8');
    console.log('同步完成，内容已写入 NOTION_SYNC.md');
  } catch (err) {
    console.error('同步失败:', err);
    process.exit(1);
  }
}

main();
