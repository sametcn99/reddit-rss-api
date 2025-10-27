import { parseRSSFeed } from './fetch.ts';
import { isNumber, mergedSubreddits } from './utils.ts';
import {
	constrsuctMergedFeedUrls,
	constructRedditFeedUrl,
} from './validators.ts';

export function handleFilter(data: ResponseData, filter: string): ResponseData {
	const filterArr = filter.toLocaleLowerCase().split(' ');
	filterArr.forEach((filter) => {
		if (filter === 'image') {
			data.items = data.items.filter((item) =>
				item.images ? item.images.length > 0 : null
			);
		} else if (filter === 'video') {
			data.items = data.items.filter((item) =>
				item.videos ? item.videos.length > 0 : null
			);
		} else {
			throw new Error(
				"Invalid filter option. Avaible filter options: 'image', 'video'",
			);
		}
	});
	return data;
}

export function handleRandomPost(data: ResponseData): ExtractedItem {
	const randomIndex = Math.floor(Math.random() * data.items.length);
	const randomPost = data.items[randomIndex];
	return randomPost;
}

export function handleSort(data: ResponseData, sort: string): ResponseData {
	data.items = data.items.sort((a, b) => {
		if (sort === 'asc' || sort === undefined) {
			return a.isoDate > b.isoDate ? 1 : -1;
		} else if (sort === 'desc') {
			return a.isoDate < b.isoDate ? 1 : -1;
		} else if (sort === 'mixed') {
			return Math.random() - 0.5;
		} else {
			throw new Error(
				"Invalid sort option. Use 'asc', 'desc' or 'mixed' as sort option.",
			);
		}
	});
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

	let data: ResponseData | ExtractedItem;
	data = {
		title: '',
		lastBuildDate: new Date(),
		link: '',
		feedUrl: '',
		itemsLength: 0,
		items: [],
	};
	if (!option && !sort && !filter && !merge && !count) {
		data = await parseRSSFeed(feedUrl, useOldReddit);
		return data;
	}

	if (merge === 'true') {
		const feedUrls = constrsuctMergedFeedUrls(pathnames[1], useOldReddit);
		data = await mergedSubreddits(feedUrls, pathnames[1], useOldReddit);
	} else if (merge !== 'true' && merge !== null && merge !== 'false') {
		throw new Error("Invalid merge option. Use 'true' as merge option.");
	} else if (merge === 'false' || merge === null) {
		data = await parseRSSFeed(feedUrl, useOldReddit);
	}
	if (sort) {
		data = handleSort(data, sort);
	} else if (
		sort !== 'asc' &&
		sort !== 'desc' &&
		sort !== 'mixed' &&
		sort !== null
	) {
		throw new Error(
			"Invalid sort option. Avaible filter options are 'asc', 'desc' and 'mixed",
		);
	}
	if (filter) {
		data = handleFilter(data as ResponseData, filter);
	}
	if (option === 'random') {
		data = handleRandomPost(data);
	} else if (option !== 'random' && option !== null) {
		throw new Error("Invalid option. Use 'random' as option.");
	}
	if ('items' in data && count !== null && count < data.items.length) {
		data.items = data.items.slice(0, count);
	}
	if ('items' in data) {
		data.itemsLength = data.items.length;
	}
	return data as ResponseData | ExtractedItem;
}
