# Overview

[![Deno](https://github.com/sametcn99/reddit-rss-api/actions/workflows/deno.yml/badge.svg)](https://github.com/sametcn99/reddit-rss-api/actions/workflows/deno.yml)  

This project is a Deno-based server application serving as an API for fetching Reddit posts from RSS feeds. It offers multiple endpoints to retrieve posts from one or more subreddits.

## Merging Subreddits

The merge option enables you to gather data from multiple RSS feeds and consolidate them into a single response. By default, Reddit's RSS feed can return data from multiple subreddits in one request, but it has limitations on the amount of data. Setting the merge option to true prompts our API to send separate requests for each specified subreddit and then merge the results. This method yields more items compared to Reddit's default multiple subreddit RSS feed.

## Getting Started

- Initiate API usage by sending requests to [https://reddit-rss-api.deno.dev/r/{subreddits}](https://reddit-rss-api.deno.dev/r/{subreddits}).
- You can specify multiple subreddit names by separating them with a `+`.

### Combining Query Parameters

When using the API, you can combine different query parameters to tailor your request according to your needs.

## Query Parameters

- **option**: Set this query parameter to `random` to fetch a random post from the specified subreddit(s).
- **sort**: Set this query parameter to `mixed`, `asc`, or `desc` to sort the posts.
- **filter**: Set this query parameter to `image`, `video` or `video+image` to retrieve only filtered posts from the feeds.
- **merge**: Set this query parameter to `true` or `false` to merge items from multiple subreddits, useful for obtaining more posts from the feeds.
- **count**: Set this query parameter for limit items. (count={number})

## Response Types
``` typescript
type ResponseData = {
  feed?: Feed;
  title: string;
  lastBuildDate: Date;
  link: string;
  feedUrl: string;
  itemsLength?: number;
  items: ExtractedItem[];
};

type ExtractedItem = {
  title: string;
  link: string;
  author: string;
  isoDate: Date;
  feedURL: string;
  id: string;
  message?: string;
  links?: string[];
  images?: string[];
  videos?: string[];
};

type Feed = {
  title: string;
  lastBuildDate: Date;
  link: string;
  feedUrl: string;
  items: FeedItem[];
};

type FeedItem = {
  id: string;
  title: string;
  link: string;
  pubDate: Date;
  author: string;
  content: string;
  contentSnippet: string;
  isoDate: Date;
};

```

![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)[ Check out example endpoints on Postman Docs.](https://documenter.getpostman.com/view/30816351/2sA3Qs8WVo)

![Github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)[ Source Code](https://github.com/sametcn99/reddit-rss-api)
