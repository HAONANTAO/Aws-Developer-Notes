import fs from 'fs';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

// 递归拉取所有块，包括子块
async function fetchBlocksRecursive(blockId) {
  let allBlocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      allBlocks.push(block);

      // 如果该块有子块，递归拉取
      if (block.has_children) {
        const childBlocks = await fetchBlocksRecursive(block.id);
        allBlocks = allBlocks.concat(childBlocks);
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return allBlocks;
}

function extractTextFromBlocks(blocks) {
  let content = '';

  for (const block of blocks) {
    if (!block || typeof block.type !== 'string') continue;

    if (block.type === 'paragraph' && block.paragraph?.text?.length > 0) {
      content += block.paragraph.text.map(t => t.plain_text).join('') + '\n\n';
    } else if (block.type === 'heading_1' && block.heading_1?.text?.length > 0) {
      content += '# ' + block.heading_1.text.map(t => t.plain_text).join('') + '\n\n';
    } else if (block.type === 'heading_2' && block.heading_2?.text?.length > 0) {
      content += '## ' + block.heading_2.text.map(t => t.plain_text).join('') + '\n\n';
    } else if (block.type === 'heading_3' && block.heading_3?.text?.length > 0) {
      content += '### ' + block.heading_3.text.map(t => t.plain_text).join('') + '\n\n';
    }
    // 这里可以继续支持更多类型，比如 bulleted_list_item, numbered_list_item 等
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
    if (blocks.length === 0) {
      console.warn('⚠️ 页面没有可写入的文本内容');
    }

    const markdown = extractTextFromBlocks(blocks);

    if (!markdown.trim()) {
      console.warn('⚠️ 页面内容为空，未提取到文本');
    }

    fs.writeFileSync('NOTION_SYNC.md', markdown, 'utf8');
    console.log('同步完成，内容已写入 NOTION_SYNC.md');
  } catch (err) {
    console.error('同步失败:', err);
    process.exit(1);
  }
}

main();
