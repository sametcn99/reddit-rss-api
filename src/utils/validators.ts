/**
 * Checks if a given string is a valid URL.
 * @param string - The string to be validated.
 * @returns A boolean indicating whether the string is a valid URL or not.
 */
export function isValidUrl(string: string) {
	try {
		new URL(string);
		return true;
	} catch (_) {
		return false;
	}
}

/**
 * Checks if the given pathnames represent a subreddit path.
 *
 * @param pathnames - An array of pathnames.
 * @returns A boolean indicating whether the pathnames represent a subreddit path.
 */
export function isSubredditPath(pathnames: string[]): boolean {
	return pathnames[0] === 'r' && pathnames.length === 2;
}

/**
 * Constructs a Reddit feed URL based on the given pathnames.
 * @param pathnames - An array of strings representing the pathnames for the Reddit feed.
 * @returns The constructed Reddit feed URL.
 */
export function constructRedditFeedUrl(
	pathnames: string[],
	useOldReddit = false,
): string {
	const baseUrl = useOldReddit
		? 'https://old.reddit.com'
		: 'https://www.reddit.com';
	return `${baseUrl}/${pathnames[0]}/${pathnames[1]}/.rss`;
}

/**
 * Checks if the given pathnames represent multiple subreddits.
 *
 * @param pathnames - An array of pathnames.
 * @returns A boolean indicating whether the pathnames represent multiple subreddits.
 */
export function checkForMultipleSubreddits(pathnames: string[]): boolean {
	return pathnames[1].includes('+');
}

/**
 * Extracts the individual subreddits from the given pathnames.
 *
 * @param pathnames - An array of pathnames.
 * @returns An array of strings containing the individual subreddits.
 */
export function extractSubreddits(pathnames: string): string[] {
	return pathnames.split('+');
}

export function constrsuctMergedFeedUrls(
	subreddits: string,
	useOldReddit = false,
): string[] {
	const subredditsArray = extractSubreddits(subreddits);
	return subredditsArray.map((subreddit) =>
		constructRedditFeedUrl(['r', subreddit], useOldReddit)
	);
}
