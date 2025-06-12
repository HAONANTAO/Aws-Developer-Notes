// scripts/notion-sync.js
const fs = require('fs');
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

async function fetchPage() {
  try {
    // 这里示例只简单获取页面块内容
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });
    
    // 简单转成 markdown 或纯文本，你可以用更复杂的转换
    let content = '';
    response.results.forEach(block => {
      if (block.type === 'paragraph') {
        content += block.paragraph.text.map(t => t.plain_text).join('') + '\n';
      }
      // 你可以扩展支持更多 block 类型
    });

    // 写到本地文件
    fs.writeFileSync('NOTION_SYNC.md', content, 'utf8');
    console.log('Notion content saved to NOTION_SYNC.md');
  } catch (error) {
    console.error('Fetch Notion page failed:', error);
    process.exit(1);
  }
}

fetchPage();
