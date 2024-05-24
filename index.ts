import {
  constrsuctMergedFeedUrls,
  isSubredditPath,
} from "./src/utils/validators.ts";
import { constructRedditFeedUrl } from "./src/utils/validators.ts";
import { corsHeaders } from "./src/lib/lib.ts";
import { parseRSSFeed } from "./src/utils/fetch.ts";
import {
  logRequestBody,
  getReadme,
  sendBadRequestResponse,
  sendOKResponse,
  mergedSubreddits,
} from "./src/utils/utils.ts";
import { getRandomPost } from "./src/utils/extracters.ts";

Deno.serve(async (req) => {
  logRequestBody(req);

  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const url = new URL(req.url);
  const pathnames = url.pathname.split("/").filter(Boolean);

  let data: ResponseData[] | ResponseData | ExtractedItem;

  if (pathnames.length === 0) {
    const readmeText = await getReadme();
    return new Response(readmeText, {
      headers: {
        "Content-Type": "text/html",
        ...corsHeaders,
      },
      status: 200,
      statusText: "OK",
    });
  }

  if (isSubredditPath(pathnames)) {
    const feedUrl = constructRedditFeedUrl(pathnames);
    const option = url.searchParams.get("option");
    const sort = url.searchParams.get("sort");
    const filter = url.searchParams.get("filter");
    const merge = url.searchParams.get("merge");
    if (merge === "true") {
      const feedUrls = constrsuctMergedFeedUrls(pathnames[1]);
      data = await mergedSubreddits(feedUrls, pathnames[1]);
      if (option === "random") {
        const randomIndex = Math.floor(Math.random() * data.items.length);
        let randomPost = data.items[randomIndex];
        if (filter === "image") {
          const filteredItems = data.items.filter(
            (item) => item.images !== undefined && item.images.length > 0
          );
          const randomIndex = Math.floor(Math.random() * filteredItems.length);
          randomPost = filteredItems[randomIndex];
        }
        return sendOKResponse(randomPost);
      }
      if (sort) {
        data.items = data.items.sort((a, b) => {
          if (sort === "asc" || sort === undefined) {
            return a.isoDate > b.isoDate ? 1 : -1;
          } else {
            // sort === "desc"
            return a.isoDate < b.isoDate ? 1 : -1;
          }
        });
        return sendOKResponse(data);
      }
      return sendOKResponse(data);
    }
    if (option === "random") {
      data = await getRandomPost(feedUrl, filter);
      return sendOKResponse(data);
    }
    if (sort) {
      data = await parseRSSFeed(feedUrl);
      data.items = data.items.sort((a, b) => {
        if (sort === "asc" || sort === undefined) {
          return a.isoDate > b.isoDate ? 1 : -1;
        } else {
          // sort === "desc"
          return a.isoDate < b.isoDate ? 1 : -1;
        }
      });
      return sendOKResponse(data);
    }
    if (filter === "image") {
      data = await parseRSSFeed(feedUrl);
      data.items = data.items.filter(
        (item) => item.images !== undefined && item.images.length > 0
      );
      data.itemsLength = data.items.length;
      return sendOKResponse(data);
    }
    data = await parseRSSFeed(feedUrl);
    return sendOKResponse(data);
  }

  return sendBadRequestResponse();
});
