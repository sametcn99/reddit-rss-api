import { HTMLElement, parse } from 'node-html-parser';
import { parseRSSFeed } from './fetch.ts';

const REDDIT_DOMAIN_REGEX = /^https?:\/\/(www\.)?reddit\.com/;

export function mapToOldReddit(url: string): string {
	return REDDIT_DOMAIN_REGEX.test(url)
		? url.replace(REDDIT_DOMAIN_REGEX, 'https://old.reddit.com')
		: url;
}

/**
 * Extracts relevant information from an array of feed items.
 * @param items - The array of feed items to extract information from.
 * @returns An array of extracted items containing the title, link, author, isoDate, id, links, and images.
 * @throws An error if no content is found in the RSS feed.
 */
export function extractItems(
	items: FeedItem[],
	feed: Feed,
	useOldReddit = false,
): ExtractedItem[] {
	return items.map((item) => {
		if (!item.content) {
			throw new Error(`No content found in the RSS feed.`);
		}
		const { links, images, videos, message } = extractLinksAndImages(
			item.content,
		);
		const itemLink = useOldReddit ? mapToOldReddit(item.link) : item.link;
		const feedUrl = useOldReddit
			? mapToOldReddit(feed.feedUrl)
			: feed.feedUrl;

		return {
			title: item.title,
			link: itemLink,
			author: item.author,
			isoDate: item.isoDate,
			id: item.id,
			feedURL: feedUrl,
			message: message ? message : undefined,
			links: links.length > 0 ? links : undefined,
			images: images.length > 0 ? images : undefined,
			videos: videos.length > 0 ? videos : undefined,
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
	let links = extractAttributes(dom.querySelectorAll('a'), 'href');
	const images = extractAttributes(dom.querySelectorAll('img'), 'src');
	const message = dom.querySelector('div')?.innerText;
	const youtube = links.filter((link) => link.includes('youtube.com'));
	const redditVideos = links.filter((link) => link.includes('v.redd.it'));
	const videos = [...youtube, ...redditVideos];
	// remove images and videos from links
	links = links.filter((link) => {
		return (
			!images.includes(link) &&
			!videos.includes(link) &&
			!link.includes('https://www.reddit.com/user/') &&
			!link.includes('https://www.reddit.com/r/') &&
			!link.includes('https://old.reddit.com/user/') &&
			!link.includes('https://old.reddit.com/r/')
		);
	});
	links = [...new Set(links)];
	return { links, images, videos, message };
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
	attribute: string,
): string[] {
	return elements.map((element) => element.getAttribute(attribute) || '');
}

export async function getRandomPost(
	feedUrl: string,
	filter: string | null,
): Promise<ExtractedItem> {
	const data = await parseRSSFeed(feedUrl);
	const randomIndex = Math.floor(Math.random() * data.items.length);
	let randomPost = data.items[randomIndex];
	if (filter === 'image') {
		const filteredItems = data.items.filter(
			(item) => item.images !== undefined && item.images.length > 0,
		);
		const randomIndex = Math.floor(Math.random() * filteredItems.length);
		randomPost = filteredItems[randomIndex];
	}
	return randomPost;
}
