import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";

// 初始化 Notion 客户端
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const pageId = process.env.NOTION_PAGE_ID;

// 简单示范：读取页面块并导出到 markdown 文件
async function getPageBlocks(id) {
  const blocks = [];
  let cursor;
  while (true) {
    const res = await notion.blocks.children.list({
      block_id: id,
      start_cursor: cursor,
    });
    blocks.push(...res.results);
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }
  return blocks;
}

function blockToMarkdown(block) {
  switch (block.type) {
    case "paragraph":
      return block.paragraph.text.map(t => t.plain_text).join("") + "\n\n";
    case "heading_1":
      return "# " + block.heading_1.text.map(t => t.plain_text).join("") + "\n\n";
    case "heading_2":
      return "## " + block.heading_2.text.map(t => t.plain_text).join("") + "\n\n";
    case "heading_3":
      return "### " + block.heading_3.text.map(t => t.plain_text).join("") + "\n\n";
    case "bulleted_list_item":
      return "- " + block.bulleted_list_item.text.map(t => t.plain_text).join("") + "\n";
    case "numbered_list_item":
      return "1. " + block.numbered_list_item.text.map(t => t.plain_text).join("") + "\n";
    case "code":
      return "```\n" + block.code.text.map(t => t.plain_text).join("") + "\n```\n\n";
    default:
      return "";
  }
}

async function main() {
  const blocks = await getPageBlocks(pageId);
  const mdContent = blocks.map(blockToMarkdown).join("");
  const filePath = path.resolve(process.cwd(), "notes.md");
  fs.writeFileSync(filePath, mdContent);
  console.log("Notion page exported to notes.md");
}

main().catch(console.error);
