// scripts/notion-sync.js
import fs from 'fs';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

async function fetchPage() {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    let content = '';
    response.results.forEach(block => {
      if (block.type === 'paragraph') {
        content += block.paragraph.text.map(t => t.plain_text).join('') + '\n';
      }
    });

    fs.writeFileSync('NOTION_SYNC.md', content, 'utf8');
    console.log('Notion content saved to NOTION_SYNC.md');
  } catch (error) {
    console.error('Fetch Notion page failed:', error);
    process.exit(1);
  }
}

fetchPage();
