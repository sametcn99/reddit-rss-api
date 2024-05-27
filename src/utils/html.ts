import { corsHeaders } from "../lib/lib.ts";
import { Marked } from "npm:@ts-stack/markdown";
import { parseRSSFeed } from "./fetch.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

/**
 * Retrieves the content of the README.md file, parses it as HTML, and adds additional elements and styles.
 * @returns The parsed HTML content with added elements and styles.
 */
export async function getReadme() {
  const ENCODING = "utf-8";
  const README_PATH = "README.md";
  const textDecoder = new TextDecoder(ENCODING);
  const readmeContent = await Deno.readFile(README_PATH);
  const decodedReadmeContent = textDecoder.decode(readmeContent);

  const parsedHtml = parseHtml(decodedReadmeContent) as unknown as Document;
  addTitleToHtml(parsedHtml, "Reddit RSS API");
  addStylesToHtml(parsedHtml);
  addMetaTagsToHtml(parsedHtml);

  return parsedHtml;
}

/**
 * Parses the given HTML content and returns the parsed HTML document.
 *
 * @param content - The HTML content to parse.
 * @returns The parsed HTML document.
 * @throws An error if the content fails to parse.
 */
function parseHtml(content: string) {
  const htmlContent = Marked.parse(content);
  const domParser = new DOMParser();
  const parsedHtml = domParser.parseFromString(htmlContent, "text/html");
  if (!parsedHtml) {
    throw new Error(`Failed to parse the content.`);
  }
  return parsedHtml;
}

/**
 * Adds a title element to the HTML document.
 *
 * @param parsedHtml - The parsed HTML document.
 * @param title - The title to be added.
 */
function addTitleToHtml(parsedHtml: Document, title: string) {
  const titleElement = parsedHtml.createElement("title");
  titleElement.textContent = title;
  parsedHtml.head.appendChild(titleElement);
}

/**
 * Adds styles to the HTML document.
 * @param parsedHtml - The parsed HTML document.
 */
function addStylesToHtml(parsedHtml: Document) {
  const BACKGROUND_COLOR = "#0C0C0C";
  const TEXT_COLOR = "#fff";
  const MAX_WIDTH = "800px";
  const FONT_FAMILY = "Arial, sans-serif";
  const LINK_COLOR = "#002DCE";

  const styleElement = parsedHtml.createElement("style");
  styleElement.textContent = `
    body {
      background-color: ${BACKGROUND_COLOR};
      color: ${TEXT_COLOR};
      max-width: ${MAX_WIDTH};
      margin: auto;
      font-family: ${FONT_FAMILY};
    }
    a {
      color: ${LINK_COLOR};
      font-weight: bold;
      font-family: ${FONT_FAMILY};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    code {
      background-color: #808080;
      padding-right: 5px;
      padding-left: 5px;
      border-radius: 8px;
    }
  `;
  parsedHtml.head.appendChild(styleElement);
}

/**
 * Adds meta tags to the HTML document.
 *
 * @param parsedHtml - The parsed HTML document.
 */
function addMetaTagsToHtml(parsedHtml: Document) {
  const metaTags = [
    { name: "title", content: "Reddit RSS API" },
    {
      name: "description",
      content:
        "An API for fetching Reddit posts from RSS feeds. It offers multiple endpoints to retrieve posts from one or more subreddits.",
    },
    { name: "keywords", content: "reddit rss, reddit api" },
    { name: "robots", content: "index, follow" },
    { httpEquiv: "Content-Type", content: "text/html; charset=utf-8" },
    { name: "language", content: "English" },
    { name: "author", content: "sametcn99" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    // add favicon meta tag to the HTML from the file
  ];
  for (const metaTag of metaTags) {
    const metaElement = parsedHtml.createElement("meta");

    if (metaTag.name) {
      metaElement.setAttribute("name", metaTag.name);
    }
    if (metaTag.httpEquiv) {
      metaElement.setAttribute("http-equiv", metaTag.httpEquiv);
    }
    metaElement.setAttribute("content", metaTag.content);
    parsedHtml.head.appendChild(metaElement);
  }
}
