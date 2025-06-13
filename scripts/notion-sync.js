import fs from 'fs';
import { Client } from '@notionhq/client';

// 初始化 Notion 客户端
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

async function fetchAllBlocks(blockId) {
  let blocks = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    if (!response || !response.results) {
      throw new Error('Notion API 返回结果中没有 results');
    }

    blocks = blocks.concat(response.results);
    cursor = response.has_more ? response.next_cursor : undefined;

    // 递归获取嵌套内容（如 toggle 子内容）
    for (const block of response.results) {
      if (block.has_children) {
        const children = await fetchAllBlocks(block.id);
        blocks = blocks.concat(children);
      }
    }
  } while (cursor);

  return blocks;
}

function extractTextFromBlocks(blocks) {
  let content = '';

  for (const block of blocks) {
    if (!block || typeof block.type !== 'string') continue;

    const getText = (richText) =>
      richText?.map(t => t.plain_text).join('') || '';

    switch (block.type) {
      case 'heading_1':
        content += `# ${getText(block.heading_1.rich_text)}\n\n`;
        break;
      case 'heading_2':
        content += `## ${getText(block.heading_2.rich_text)}\n\n`;
        break;
      case 'heading_3':
        content += `### ${getText(block.heading_3.rich_text)}\n\n`;
        break;
      case 'paragraph':
        content += `${getText(block.paragraph.rich_text)}\n\n`;
        break;
      case 'bulleted_list_item':
        content += `- ${getText(block.bulleted_list_item.rich_text)}\n`;
        break;
      case 'numbered_list_item':
        content += `1. ${getText(block.numbered_list_item.rich_text)}\n`;
        break;
      case 'quote':
        content += `> ${getText(block.quote.rich_text)}\n\n`;
        break;
      case 'code':
        content += `\`\`\`${block.code.language || ''}\n${getText(block.code.rich_text)}\n\`\`\`\n\n`;
        break;
      case 'toggle':
        content += `<details><summary>${getText(block.toggle.rich_text)}</summary>\n\n`;
        break;
      case 'unsupported':
        content += '[Unsupported Block]\n\n';
        break;
    }
  }

  return content;
}

function sanitizeContent(content) {
  return content
    // AWS Key ID
    .replace(/AKIA[0-9A-Z]{16}/g, '[REDACTED_AWS_KEY_ID]')
    // AWS Secret Access Key
    .replace(/(?<=AWS_SECRET_ACCESS_KEY\s*=?\s*)[A-Za-z0-9\/+=]{40,}/g, '[REDACTED_AWS_SECRET]')
    // 可能的环境变量行
    .replace(/(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY)\s*=\s*.*$/gm, '[REDACTED_ENV_VARIABLE]');
}

async function main() {
  if (!pageId || !process.env.NOTION_TOKEN) {
    console.error('❌ 请确保设置了 NOTION_TOKEN 和 NOTION_PAGE_ID 环境变量');
    process.exit(1);
  }

  try {
    console.log('📥 正在从 Notion 页面拉取内容...');
    const blocks = await fetchAllBlocks(pageId);
    const markdown = extractTextFromBlocks(blocks);
    const sanitized = sanitizeContent(markdown);

    fs.writeFileSync('NOTION_SYNC.md', sanitized || '# 页面为空\n', 'utf8');
    console.log('✅ 同步完成，内容已写入 NOTION_SYNC.md');
  } catch (err) {
    console.error('❌ 同步失败:', err);
    process.exit(1);
  }
}

main();
