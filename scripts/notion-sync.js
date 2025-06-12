import fs from 'fs';
import { Client } from '@notionhq/client';

// 从环境变量读取token和pageId
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

    blocks = blocks.concat(response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

function extractTextFromBlocks(blocks) {
  let content = '';

  for (const block of blocks) {
    if (!block || typeof block.type !== 'string') {
      // 跳过无效block
      continue;
    }

    if (block.type === 'paragraph' && block.paragraph?.text?.length > 0) {
      content += block.paragraph.text.map(t => t.plain_text).join('') + '\n\n';
    } else if (block.type === 'heading_1' && block.heading_1?.text?.length > 0) {
      content += '# ' + block.heading_1.text.map(t => t.plain_text).join('') + '\n\n';
    } else if (block.type === 'heading_2' && block.heading_2?.text?.length > 0) {
      content += '## ' + block.heading_2.text.map(t => t.plain_text).join('') + '\n\n';
    } else if (block.type === 'heading_3' && block.heading_3?.text?.length > 0) {
      content += '### ' + block.heading_3.text.map(t => t.plain_text).join('') + '\n\n';
    }
    // 可继续支持更多类型
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
    const markdown = extractTextFromBlocks(blocks);

    fs.writeFileSync('NOTION_SYNC.md', markdown, 'utf8');
    console.log('同步完成，内容已写入 NOTION_SYNC.md');
  } catch (err) {
    console.error('同步失败:', err);
    process.exit(1);
  }
}

main();
