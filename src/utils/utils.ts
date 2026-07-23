import { corsHeaders } from '../lib/lib.ts';
import { parseRSSFeed } from './fetch.ts';

/**
 * Sends a bad request response.
 */
export function sendBadRequestResponse(error?: string): Response {
	return new Response(error, {
		status: 400,
		headers: {
			'Content-Type': 'text/plain',
			...corsHeaders,
		},
	});
}

/**
 * Sends an OK response with the provided data.
 */
export function sendOKResponse(
	data: ExtractedItem | ResponseData[] | ResponseData | string,
): Response {
	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders,
		},
	});
}

export async function mergedSubreddits(
	feedUrls: string[],
	pathnames: string,
	useOldReddit = false,
): Promise<ResponseData> {
	const subreddits = pathnames.split('+');
	const data: ResponseData = {
		title: `Merged feed for ${subreddits.join(' + ')}`,
		lastBuildDate: new Date(),
		link: `https://reddit-rss-api.sametcn99.deno.net/r/${pathnames}`,
		feedUrl: 'https://reddit-rss-api.sametcn99.deno.net/',
		items: [],
	};

	const feedDataArray = await Promise.all(
		feedUrls.map((feedUrl) => parseRSSFeed(feedUrl, useOldReddit)),
	);
	for (const feedData of feedDataArray) {
		data.items.push(...feedData.items);
	}
	data.itemsLength = data.items.length;
	return data;
}

export function isNumber(value?: string | number): boolean {
	return ((value != null) &&
		(value !== '') &&
		!isNaN(Number(value.toString())));
}
