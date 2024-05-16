# Overview

This project appears to be a Deno-based server application that serves as an API for fetching Reddit posts from rss feed. It provides several endpoints to fetch posts from one or more subreddits.

## API Endpoints

### Multi Feed

- **Method**: `GET`
- **URL**: `http://reddit-rss-api.deno.dev/r/{subreddit1+subreddit2+...}`
- **Description**: This endpoint fetches posts from multiple subreddits, specified in the URL as a `+`-delimited list.
- **Example**: To fetch posts from both `memes` and `dankmemes` subreddits, the request would be:
  
  ``
  http://reddit-rss-api.deno.dev/r/memes+dankmemes
  ``

### Single Feed

- **Method**: `GET`
- **URL**: `http://reddit-rss-api.deno.dev/r/{subreddit}`
- **Description**: This endpoint fetches posts from a single subreddit specified in the URL.
- **Example**: To fetch posts from the `memes` subreddit, the request would be:
  
  ``
  http://reddit-rss-api.deno.dev/r/memes
  ``

### Random Post

- **Method**: `GET`
- **URL**: `http://reddit-rss-api.deno.dev/r/{subreddit1+subreddit2+...}?option=random`
- **Description**: This endpoint fetches a random post from one or more subreddits. Subreddits are specified in the URL as a `+`-delimited list. The `option=random` query parameter must be included.
- **Example**: To fetch a random post from the `memes` subreddit, the request would be:
  
  ``
  http://reddit-rss-api.deno.dev/r/memes?option=random
  ``

### Query Parameters

- **option**: This query parameter can be set to `random` to fetch a random post from the specified subreddit(s).

[Source Code](https://github.com/sametcn99/reddit-rss-api)
