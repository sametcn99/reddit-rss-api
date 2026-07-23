import { corsHeaders } from '../lib/lib.ts';
import { parseRSSFeed } from './fetch.ts';

export class UpstreamError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UpstreamError';
	}
}

export class TimeoutError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
 * Sends a response with the provided data and status code.
 */
export function sendResponse(
	data: unknown,
	status: number,
	contentType: string,
): Response {
	return new Response(
		typeof data === 'string' ? data : JSON.stringify(data),
		{
			status,
			headers: {
				'Content-Type': contentType,
				...corsHeaders,
			},
		},
	);
}

/**
 * Sends a bad request response.
 */
export function sendBadRequestResponse(error?: string): Response {
	return sendResponse(error, 400, 'text/plain');
}

/**
 * Sends an OK response with the provided data.
 */
export function sendOKResponse(
	data: ExtractedItem | ResponseData[] | ResponseData | string,
): Response {
	return sendResponse(data, 200, 'application/json');
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
