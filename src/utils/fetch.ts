import Parser from 'rss-parser';
import { extractItems, mapToOldReddit } from './extracters.ts';

const parser = new Parser();
const FETCH_TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { data: ResponseData; expires: number }>();

/**
 * Fetches and parses an RSS feed, with a short in-memory cache to avoid
 * hammering Reddit on repeated requests for the same feed.
 */
export async function parseRSSFeed(
	feedUrl: string,
	useOldReddit = false,
): Promise<ResponseData> {
	const cacheKey = `${feedUrl}:${useOldReddit}`;
	const cached = cache.get(cacheKey);
	if (cached && cached.expires > Date.now()) {
		return cached.data;
	}

	try {
		const response = await fetch(feedUrl, {
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
			headers: { 'User-Agent': 'reddit-rss-api/1.0' },
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch the RSS feed (HTTP ${response.status}).`,
			);
		}

		const data = await response.text();
		const feed = (await parser.parseString(data)) as unknown as Feed;

		if (!feed.items?.length) {
			throw new Error('Failed to fetch the RSS feed.');
		}

		const extractedItems = extractItems(feed.items, feed, useOldReddit);
		const normalizedLink = useOldReddit
			? mapToOldReddit(feed.link)
			: feed.link;
		const normalizedFeedUrl = useOldReddit
			? mapToOldReddit(feed.feedUrl)
			: feed.feedUrl;

		const result: ResponseData = {
			title: feed.title,
			lastBuildDate: feed.lastBuildDate,
			link: normalizedLink,
			feedUrl: normalizedFeedUrl,
			itemsLength: feed.items.length,
			items: extractedItems,
		};

		cache.set(cacheKey, {
			data: result,
			expires: Date.now() + CACHE_TTL_MS,
		});
		return result;
	} catch (error) {
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			throw new Error('RSS feed request timed out.');
		}
		throw new Error(
			error instanceof Error
				? error.message
				: 'Failed to fetch the RSS feed.',
		);
	}
}
