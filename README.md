# API Endpoints

## Multi Feed

**Method:** GET  
**URL:** `http://reddit-rss-api.deno.dev/r/{subreddit1+subreddit2+...}`

Fetches posts from multiple subreddits.

**Example:**  
`http://reddit-rss-api.deno.dev/r/memes+dankmemes`

---

## Single Feed

**Method:** GET  
**URL:** `http://reddit-rss-api.deno.dev/r/{subreddit}`

Fetches posts from a single subreddit.

**Example:**  
`http://reddit-rss-api.deno.dev/r/memes`

---

## Random Post

**Method:** GET  
**URL:** `http://reddit-rss-api.deno.dev/r/{subreddit1+subreddit2+...}?option=random`

Fetches a random post from a single subreddit or multiple subreddits.

**Example:**  
`http://reddit-rss-api.deno.dev/r/memes?option=random`

---

## Query Parameters

- `option`: Set this to `random` to fetch a random post from a subreddit.

---

Detailed Explanation:

### Multi Feed

- **Method**: `GET`
- **URL**: `http://reddit-rss-api.deno.dev/r/{subreddit1+subreddit2+...}`
- **Description**: This endpoint fetches posts from multiple subreddits, specified in the URL as a `+`-delimited list.
- **Example**: To fetch posts from both `memes` and `dankmemes` subreddits, the request would be:
  ```
  http://reddit-rss-api.deno.dev/r/memes+dankmemes
  ```

### Single Feed

- **Method**: `GET`
- **URL**: `http://reddit-rss-api.deno.dev/r/{subreddit}`
- **Description**: This endpoint fetches posts from a single subreddit specified in the URL.
- **Example**: To fetch posts from the `memes` subreddit, the request would be:
  ```
  http://reddit-rss-api.deno.dev/r/memes
  ```

### Random Post

- **Method**: `GET`
- **URL**: `http://reddit-rss-api.deno.dev/r/{subreddit1+subreddit2+...}?option=random`
- **Description**: This endpoint fetches a random post from one or more subreddits. Subreddits are specified in the URL as a `+`-delimited list. The `option=random` query parameter must be included.
- **Example**: To fetch a random post from the `memes` subreddit, the request would be:
  ```
  http://reddit-rss-api.deno.dev/r/memes?option=random
  ```

### Query Parameters

- **option**: This query parameter can be set to `random` to fetch a random post from the specified subreddit(s).