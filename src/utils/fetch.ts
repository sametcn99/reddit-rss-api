import Parser from 'rss-parser';
import { extractItems, mapToOldReddit } from './extracters.ts';

/**
 * Parses an RSS feed and returns the extracted data.
 * @param feedUrl - The URL of the RSS feed to parse.
 * @returns The parsed RSS feed data.
 * @throws If there is an error fetching or parsing the RSS feed.
 */
export async function parseRSSFeed(
	feedUrl: string,
	useOldReddit = false,
): Promise<ResponseData> {
	try {
		const parser = new Parser();

		const response = await fetch(feedUrl);

		if (!response.ok) {
			throw new Error(`Failed to fetch the RSS feed.`);
		}

		const data = await response.text();
		const feed: Feed = (await parser.parseString(data)) as unknown as Feed;

		if (!feed.items.length) {
			throw new Error(`Failed to fetch the RSS feed.`);
		}

		const extractedItems = extractItems(feed.items, feed, useOldReddit);
		const normalizedLink = useOldReddit
			? mapToOldReddit(feed.link)
			: feed.link;
		const normalizedFeedUrl = useOldReddit
			? mapToOldReddit(feed.feedUrl)
			: feed.feedUrl;

		return {
			title: feed.title,
			lastBuildDate: feed.lastBuildDate,
			link: normalizedLink,
			feedUrl: normalizedFeedUrl,
			itemsLength: feed.items.length,
			items: extractedItems,
		};
	} catch (error) {
		throw new Error(`Failed to fetch the RSS feed.`);
	}
}
