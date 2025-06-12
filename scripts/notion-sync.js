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

    blocks = blocks.concat(response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

function extractTextFromBlocks(blocks) {
  let content = '';

  for (const block of blocks) {
    if (!block || typeof block.type !== 'string') continue;

    const getText = (richText) => richText.map(t => t.plain_text).join('');

    if (block.type === 'paragraph' && block.paragraph?.rich_text?.length > 0) {
      content += getText(block.paragraph.rich_text) + '\n\n';
    } else if (block.type === 'heading_1' && block.heading_1?.rich_text?.length > 0) {
      content += '# ' + getText(block.heading_1.rich_text) + '\n\n';
    } else if (block.type === 'heading_2' && block.heading_2?.rich_text?.length > 0) {
      content += '## ' + getText(block.heading_2.rich_text) + '\n\n';
    } else if (block.type === 'heading_3' && block.heading_3?.rich_text?.length > 0) {
      content += '### ' + getText(block.heading_3.rich_text) + '\n\n';
    }
  }

  return content;
}

async function main() {
  if (!pageId || !process.env.NOTION_TOKEN) {
    console.error('❌ 请确保设置了 NOTION_TOKEN 和 NOTION_PAGE_ID');
    process.exit(1);
  }

  try {
    const blocks = await fetchAllBlocks(pageId);
    console.log(`✅ 获取 ${blocks.length} 个 blocks`);

    if (blocks.length > 0) {
      console.log('🔍 第一个 block:', JSON.stringify(blocks[0], null, 2));
    }

    const markdown = extractTextFromBlocks(blocks);

    fs.writeFileSync('NOTION_SYNC.md', markdown || '⚠️ 页面没有可写入的文本内容', 'utf8');
    console.log('✅ 同步完成，内容已写入 NOTION_SYNC.md');
  } catch (err) {
    console.error('❌ 同步失败:', err.message);
    fs.writeFileSync('NOTION_SYNC.md', '❌ 同步失败：' + err.message, 'utf8');
    process.exit(1);
  }
}

main();
