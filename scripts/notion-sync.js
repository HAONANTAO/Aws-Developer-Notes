import fs from 'fs';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

async function fetchAllBlocks(blockId) {
  let blocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    if (!Array.isArray(response.results)) {
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
        // toggle 的文本
        content += '> ' + block.toggle.text.map(t => t.plain_text).join('') + '\n\n';
        break;
      // 你还可以根据需要继续支持列表、引用等类型
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
