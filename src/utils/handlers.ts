import { parseRSSFeed } from './fetch.ts';
import { isNumber, mergedSubreddits } from './utils.ts';
import {
	constrsuctMergedFeedUrls,
	constructRedditFeedUrl,
} from './validators.ts';

export function handleFilter(data: ResponseData, filter: string): ResponseData {
	const filters = new Set(filter.toLocaleLowerCase().split(' '));
	const validFilters = new Set(['image', 'video']);

	for (const f of filters) {
		if (!validFilters.has(f)) {
			throw new Error(
				"Invalid filter option. Available filter options: 'image', 'video'",
			);
		}
	}

	data.items = data.items.filter((item) => {
		if (filters.has('image') && item.images && item.images.length > 0) {
			return true;
		}
		if (filters.has('video') && item.videos && item.videos.length > 0) {
			return true;
		}
		return false;
	});
	return data;
}

export function handleRandomPost(data: ResponseData): ExtractedItem {
	if (data.items.length === 0) {
		throw new Error('No items available to pick a random post from.');
	}
	const randomIndex = Math.floor(Math.random() * data.items.length);
	return data.items[randomIndex];
}

export function handleSort(data: ResponseData, sort: string): ResponseData {
	const sorted = [...data.items];
	if (sort === 'asc') {
		sorted.sort((a, b) =>
			new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime()
		);
	} else if (sort === 'desc') {
		sorted.sort((a, b) =>
			new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
		);
	} else if (sort === 'mixed') {
		for (let i = sorted.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[sorted[i], sorted[j]] = [sorted[j], sorted[i]];
		}
	} else {
		throw new Error(
			"Invalid sort option. Use 'asc', 'desc' or 'mixed' as sort option.",
		);
	}
	data.items = sorted;
	return data;
}

export function handleMerge(
	feedUrls: string[],
	path: string,
	useOldReddit = false,
) {
	return mergedSubreddits(feedUrls, path, useOldReddit);
}

export function getQueryParams(url: URL): {
	option: string | null;
	sort: string | null;
	filter: string | null;
	merge: string | null;
	count: number | null;
	oldReddit: string | null;
} {
	const option = url.searchParams.get('option');
	const sort = url.searchParams.get('sort');
	const filter = url.searchParams.get('filter');
	const merge = url.searchParams.get('merge');
	let count = url.searchParams.get('count') as string | number | null;
	const oldReddit = url.searchParams.get('old_reddit');
	if (count !== null) {
		if (isNumber(count)) {
			count = Number(count);
		} else {
			throw new Error('Count must be a number.');
		}
	}
	return { option, sort, filter, merge, count, oldReddit };
}

export async function handleResponse(
	url: URL,
	pathnames: string[],
): Promise<ResponseData | ExtractedItem> {
	const { option, sort, filter, merge, count, oldReddit } = getQueryParams(
		url,
	);

	if (oldReddit !== null && oldReddit !== 'true' && oldReddit !== 'false') {
		throw new Error("Invalid old_reddit option. Use 'true' or 'false'.");
	}

	const useOldReddit = oldReddit === 'true';
	const feedUrl = constructRedditFeedUrl(pathnames, useOldReddit);

	// Fast path: no query params, just fetch and return
	if (!option && !sort && !filter && !merge && !count) {
		return await parseRSSFeed(feedUrl, useOldReddit);
	}

	let data: ResponseData;

	if (merge === 'true') {
		const feedUrls = constrsuctMergedFeedUrls(pathnames[1], useOldReddit);
		data = await mergedSubreddits(feedUrls, pathnames[1], useOldReddit);
	} else if (merge !== null && merge !== 'false') {
		throw new Error("Invalid merge option. Use 'true' as merge option.");
	} else {
		data = await parseRSSFeed(feedUrl, useOldReddit);
	}

	if (sort) {
		data = handleSort(data, sort);
	}
	if (filter) {
		data = handleFilter(data, filter);
	}
	if (option === 'random') {
		return handleRandomPost(data);
	} else if (option !== null) {
		throw new Error("Invalid option. Use 'random' as option.");
	}
	if (count !== null && count < data.items.length) {
		data.items = data.items.slice(0, count);
	}
	data.itemsLength = data.items.length;
	return data;
}
