import Parser from "npm:rss-parser";
import { extractItems } from "./extracters.ts";

/**
 * Parses an RSS feed and returns the extracted data.
 * @param RSS_FEED_URL - The URL of the RSS feed to parse.
 * @returns The parsed RSS feed data.
 * @throws If there is an error fetching or parsing the RSS feed.
 */
export async function parseRSSFeed(RSS_FEED_URL: string) {
  try {
    const parser = new Parser();
    const response = await fetch(RSS_FEED_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch the RSS feed.`);
    }

    const data = await response.text();
    const feed: Feed = (await parser.parseString(data)) as unknown as Feed;

    if (!feed.items.length) {
      throw new Error(`No items found in the RSS feed.`);
    }

    const extractedItems = extractItems(feed.items, feed);
    const responseData: ResponseData = {
      title: feed.title,
      lastBuildDate: feed.lastBuildDate,
      link: feed.link,
      feedUrl: feed.feedUrl,
      itemsLength: feed.items.length,
      items: extractedItems,
    };
    return responseData;
  } catch (error) {
    console.error(`Failed to fetch and parse RSS feed: ${error}`);
    throw error;
  }
}
