import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { mergedSubreddits } from "../utils/utils.ts";
import { parseRSSFeed } from "../utils/fetch.ts";
import { isSubredditPath } from "../utils/validators.ts";
import { getQueryParams } from "../utils/handlers.ts";
import { assertThrowsAsync } from "https://deno.land/std@0.107.0/testing/asserts.ts";

Deno.test("mergedSubreddits should return merged data", async () => {
  const feedUrls = [
    "https://www.reddit.com/r/deno/.rss",
    "https://www.reddit.com/r/typescript/.rss",
  ];
  const pathnames = "deno+typescript";
  const data = await mergedSubreddits(feedUrls, pathnames);
  assertEquals(
    data.title,
    `Merged feed for ${pathnames.split("+").join(" + ")}`
  );
});

Deno.test("parseRSSFeed should return parsed data", async () => {
  const feedUrl = "https://www.reddit.com/r/deno/.rss";
  const data = await parseRSSFeed(feedUrl);
  assertEquals(typeof data.title, "string");
  assertEquals(typeof data.link, "string");
});

Deno.test("isSubredditPath should validate subreddit paths", () => {
  const pathnames = ["r", "deno"];
  const result = isSubredditPath(pathnames);
  assertEquals(result, true);
});

Deno.test("extractQueryParams should return correct query parameters", () => {
  const url = new URL(
    "https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&filter=image"
  );
  const queryParams = getQueryParams(url);
  assertEquals(queryParams.merge, "true");
  assertEquals(queryParams.filter, "image");
});

Deno.test("parseRSSFeed throws for invalid URLs", async () => {
  await assertThrowsAsync(() => parseRSSFeed("invalid_url"));
});


Deno.test(
  "extractQueryParams should return empty object for no query parameters",
  () => {
    const url = new URL(
      "https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey"
    );
    const queryParams = getQueryParams(url);
    assertEquals(queryParams, {
      option: null,
      sort: null,
      filter: null,
      merge: null,
      count: null,
    });
  }
);
