# Reddit RSS API (discontinued)

A Deno-powered HTTP service that converted Reddit subreddit RSS feeds into structured JSON, with filtering, sorting, merging, and random selection utilities.

> [!CAUTION]
> **This project is discontinued and is no longer maintained.** Reddit feed endpoints no longer work. The source code and API documentation are retained for historical reference.

## Why this project is discontinued

- **Reddit retired RSS feeds.** Reddit announced **November 13, 2026** as the end-of-support date. This removed the data source the API depends on. Reddit states that there is no replacement for RSS feeds outside communities you moderate. See [Reddit's official announcement](https://support.reddithelp.com/hc/en-us/articles/55472297340308-Changelog-November-10-2026).
- **Deno Deploy is being shut down.** The platform hosting this service is scheduled to close in **April 2027**. Existing applications can continue running until then, but this API can no longer fetch Reddit RSS feeds. See the [Deno announcement](https://deno.com/blog/cloudflare) and [shutdown notice](https://docs.deno.com/deploy/).

The project previously moved from `reddit-rss-api.deno.dev` to `reddit-rss-api.sametcn99.deno.net` following the [Deno Deploy Classic shutdown on July 20, 2026](https://docs.deno.com/deploy/classic/deployments/). The current Deno Deploy shutdown is a separate, upcoming change.

Moving the code to another host does not restore Reddit's retired RSS feeds. The former hosted address may remain reachable temporarily, but it is no longer a supported API.

Status updated: **November 21, 2026**.

## Usage

During its last year of operation, the API received approximately **30,000 requests per month**. Thank you to everyone who used the service.

## Resources

- [Source Code](https://github.com/sametcn99/reddit-rss-api)
- [Discontinuation Notice (former hosted service)](https://reddit-rss-api.sametcn99.deno.net/)
- [Historical OpenAPI Specification](./openapi.json)

## Historical documentation

The sections below describe the API before Reddit retired RSS support. Endpoints, examples, and setup instructions are preserved for reference and no longer provide working Reddit feeds.

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

- **Base URL**: `https://reddit-rss-api.sametcn99.deno.net/`
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
curl "https://reddit-rss-api.sametcn99.deno.net/r/deno"
```

### Merge Two Subreddits and Return Only Image Posts

```bash
curl "https://reddit-rss-api.sametcn99.deno.net/r/deno+typescript?merge=true&filter=image"
```

### Get a Random Video Post with Old Reddit Links

```bash
curl "https://reddit-rss-api.sametcn99.deno.net/r/memes+videos?filter=video&option=random&old_reddit=true"
```

### Limit the Response to Five Items, Sorted Descending

```bash
curl "https://reddit-rss-api.sametcn99.deno.net/r/pics?sort=desc&count=5"
```

## Error Handling

- `400 Bad Request` for invalid paths, malformed query parameters, or RSS parsing failures.
- `405 Method Not Allowed` for non-`GET` requests.
- Error bodies include the message where available to simplify debugging.

## Development

The following commands describe the original development workflow. They are retained for reference; running or self-hosting the code does not restore Reddit RSS access. No further maintenance or support is planned.

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

> Some tests depend on live Reddit RSS endpoints and are expected to fail following Reddit's RSS retirement. They are preserved as historical reference, not as a current service-health check.
