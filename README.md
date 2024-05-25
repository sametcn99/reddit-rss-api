# Overview

This project is a Deno-based server application serving as an API for fetching Reddit posts from RSS feeds. It offers multiple endpoints to retrieve posts from one or more subreddits.

## Merging Subreddits

The merge option enables you to gather data from multiple RSS feeds and consolidate them into a single response. By default, Reddit's RSS feed can return data from multiple subreddits in one request, but it has limitations on the amount of data. Setting the merge option to true prompts our API to send separate requests for each specified subreddit and then merge the results. This method yields more items compared to Reddit's default multiple subreddit RSS feed.

## Getting Started

- Initiate API usage by sending requests to [https://reddit-rss-api.deno.dev/r/{subreddits}].
- You can specify multiple subreddit names by separating them with a `+`.

### Combining Query Parameters

When using the API, you can combine different query parameters to tailor your request according to your needs.

## Query Parameters

- **option**: Set this query parameter to `random` to fetch a random post from the specified subreddit(s).
- **sort**: Set this query parameter to `mixed`, `asc`, or `desc` to sort the specified subreddit(s).
- **filter**: Set this query parameter to `image` to retrieve only image posts from the feeds.
- **merge**: Set this query parameter to `true` or `false` to merge items from multiple subreddits, useful for obtaining more posts from the feeds.

## Enpoint Examples

- **Sort Desc from Merged**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc&merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc&merge=true)

- **Sort Asc from Merged**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc&merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc&merge=true)

- **Sort Mixed from Merged**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=mixed&merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=mixed&merge=true)

- **Sort Mixed from Merged and Filtered**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=mixed&filter=image&merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=mixed&filter=image&merge=true)

- **Sort Asc from Filtered and Merged**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc&filter=image&merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc&filter=image&merge=true)

- **Sort Desc from Merged and Filtered**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc&filter=image&merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc&filter=image&merge=true)

- **Merged feeds**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true)

- **Random Post from Merged**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&option=random](https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&option=random)

- **Sort Desc**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc)

- **Sort Asc**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc)

- **Sort Mixed**
  - URL: [https://reddit-rss-api.deno.dev/r/memes?sort=mixed](https://reddit-rss-api.deno.dev/r/memes?sort=mixed)

- **Sort Desc from Filtered**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc&filter=image](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc&filter=image)

- **Sort Asc from Filtered**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc&filter=image](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc&filter=image)

- **Sort Mixed from Filtered**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=mixed&filter=image](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=mixed&filter=image)

- **Random Image Post**
  - URL: [https://reddit-rss-api.deno.dev/r/turkey?filter=image&option=random](https://reddit-rss-api.deno.dev/r/turkey?filter=image&option=random)

- **Filter Images from Multi Feed**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?filter=image](https://reddit-rss-api.deno.dev/r/memes+dankmemes?filter=image)

- **Filter Images from Single Feed**
  - URL: [https://reddit-rss-api.deno.dev/r/turkey?filter=image](https://reddit-rss-api.deno.dev/r/turkey?filter=image)

- **Multi Feed**
  - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes](https://reddit-rss-api.deno.dev/r/memes+dankmemes)

- **Single Feed**
  - URL: [https://reddit-rss-api.deno.dev/r/memes](https://reddit-rss-api.deno.dev/r/memes)

- **Home**
  - URL: [https://reddit-rss-api.deno.dev](https://reddit-rss-api.deno.dev)

- **Random Post**
  - URL: [https://reddit-rss-api.deno.dev/r/memes?option=random](https://reddit-rss-api.deno.dev/r/memes?option=random)

[Source Code](https://github.com/sametcn99/reddit-rss-api)
