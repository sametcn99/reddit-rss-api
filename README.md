# Reddit RSS API

A Deno-powered HTTP service that turns Reddit subreddit RSS feeds into structured JSON, complete with filtering, sorting, merging, and random selection utilities.

## Resources

- [GitHub Repository](https://github.com/sametcn99/reddit-rss-api)
- [Live API & Documentation](https://reddit-rss-api.deno.dev)
- [GitHub Issues](https://github.com/sametcn99/reddit-rss-api/issues)

## Table of Contents

- [Features](#features)
- [API Overview](#api-overview)
- [Path Parameters](#path-parameters)
- [Query Parameters](#query-parameters)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Development](#development)
  - [Quick Start](#quick-start)
  - [Helpful Tasks](#helpful-tasks)
  - [Testing](#testing)

## Features

- Merge multiple subreddits by delegating individual RSS requests and consolidating the payload for richer result sets.
- Filter feed items to media-rich posts (images or videos) or fetch a random post from any combination of subreddits.
- Sort posts by publish date (`asc`, `desc`) or shuffle them (`mixed`).
- Limit response size with `count` while retaining the original `itemsLength` for reference.
- Rewrite all Reddit links to `old.reddit.com` on demand for legacy views.
- CORS-friendly JSON responses served by `[Deno.serve](https://deno.land/api?s=Deno.serve)` with a zero-dependency runtime.

## API Overview

- **Base URL**: `https://reddit-rss-api.deno.dev`
- **Root (`GET /`)**: provides basic API information and usage instructions.
- **Feed (`GET /r/{subreddits}`)**: fetches RSS-derived JSON for one or more subreddits.

### Path Parameters

- `subreddits` – one or more subreddit names separated by `+` (URL-encoded space). Example: `deno+typescript`.

## Query Parameters

- **`option`** _(string)_

  - **Values:** `random`
  - **Default:** `null`
  - **Description:** Returns a single random item from the processed feed.

- **`sort`** _(string)_

  - **Values:** `asc`, `desc`, `mixed`
  - **Default:** `asc`
  - **Description:** Orders items by publish date or shuffles them (`mixed`). Applied before `count`.

- **`filter`** _(string)_

  - **Values:** `image`, `video`, `image+video`
  - **Default:** `null`
  - **Description:** Keeps only media-rich posts. Combine options with `+` (decoded as space).

- **`merge`** _(boolean)_

  - **Values:** `true`, `false`
  - **Default:** `false`
  - **Description:** When `true`, the API fetches each subreddit individually and merges the results.

- **`count`** _(number)_

  - **Values:** `>= 1`
  - **Default:** `null`
  - **Description:** Truncates the response to the first _n_ items after all other operations.

- **`old_reddit`** _(boolean)_

  - **Values:** `true`, `false`
  - **Default:** `false`
  - **Description:** Rewrites feed and item links to use `old.reddit.com`.

> Combine parameters to compose custom feeds. Validation errors produce informative `400 Bad Request` messages.
> When `option=random` is used, the response is a single `ExtractedItem` object instead of the full feed payload.

## Usage Examples

### Fetch the Latest Posts from a Single Subreddit

```bash
curl "https://reddit-rss-api.deno.dev/r/deno"
```

### Merge Two Subreddits and Return Only Image Posts

```bash
curl "https://reddit-rss-api.deno.dev/r/deno+typescript?merge=true&filter=image"
```

### Get a Random Video Post with Old Reddit Links

```bash
curl "https://reddit-rss-api.deno.dev/r/memes+videos?filter=video&option=random&old_reddit=true"
```

### Limit the Response to Five Items, Sorted Descending

```bash
curl "https://reddit-rss-api.deno.dev/r/pics?sort=desc&count=5"
```

## Error Handling

- `400 Bad Request` for invalid paths, malformed query parameters, or RSS parsing failures.
- `405 Method Not Allowed` for non-`GET` requests.
- Error bodies include the message where available to simplify debugging.

## Development

To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure all tests pass.
4. Submit a pull request describing your changes.

### Quick Start

1. Install [Deno](https://deno.land/manual/getting_started/installation) (v1.41 or newer recommended).
2. Clone the repository and switch into the project directory.
3. Run the server:

   ```bash
   deno task start
   ```

   The service listens on `http://localhost:8000` by default.

### Helpful Tasks

- `deno task start` – run the API once with full permissions.
- `deno task dev` – watch mode for local development.
- `deno task test` – execute the unit test suite under `src/tests/`.
- `deno task fmt` – format codebase.

### Testing

Run the full suite with:

```bash
deno task test
```

> Tests rely on live Reddit RSS endpoints; ensure you have network access when executing them.
