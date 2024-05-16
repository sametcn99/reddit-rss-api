import { HTMLElement, parse } from "npm:node-html-parser";
import { parseRSSFeed } from "./fetch.ts";

/**
 * Extracts relevant information from an array of feed items.
 * @param items - The array of feed items to extract information from.
 * @returns An array of extracted items containing the title, link, author, isoDate, id, links, and images.
 * @throws An error if no content is found in the RSS feed.
 */
export function extractItems(items: FeedItem[], feed: Feed): ExtractedItem[] {
  return items.map((item) => {
    if (!item.content) {
      throw new Error(`No content found in the RSS feed.`);
    }
    const { links, images } = extractLinksAndImages(item.content);

    return {
      title: item.title,
      link: item.link,
      author: item.author,
      isoDate: item.isoDate,
      id: item.id,
      feedURL: feed.feedUrl,
      links,
      images,
    };
  });
}

/**
 * Extracts links and images from the given content.
 * @param content - The content to extract links and images from.
 * @returns An object containing the extracted links and images.
 */
export function extractLinksAndImages(content: string) {
  const dom = parse(content);
  const links = extractAttributes(dom.querySelectorAll("a"), "href");
  const images = extractAttributes(dom.querySelectorAll("img"), "src");
  return { links, images };
}

/**
 * Extracts the specified attribute from an array of HTML elements.
 *
 * @param elements - The array of HTML elements.
 * @param attribute - The name of the attribute to extract.
 * @returns An array of strings containing the values of the specified attribute for each element.
 */
export function extractAttributes(
  elements: HTMLElement[],
  attribute: string
): string[] {
  return elements.map((element) => element.getAttribute(attribute) || "");
}

export async function getRandomPost(
  subreddits: string[]
): Promise<ExtractedItem> {
  const feedUrl = `https://www.reddit.com/r/${subreddits.join("+")}/.rss`;
  const data = await parseRSSFeed(feedUrl);
  const randomIndex = Math.floor(Math.random() * data.items.length);
  const randomPost = data.items[randomIndex];
  return randomPost;
}
