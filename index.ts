import { isSubredditPath } from "./src/utils/validators.ts";
import { constructRedditFeedUrl } from "./src/utils/validators.ts";
import { corsHeaders } from "./src/lib/lib.ts";
import { parseRSSFeed } from "./src/utils/fetch.ts";
import {
  logRequestBody,
  sendBadRequestResponse,
  sendOKResponse,
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

  if (pathnames[0] === "random") {
    const subreddits = url.searchParams.get("subreddits");
    if (!subreddits) {
      return sendBadRequestResponse();
    }
    data = await getRandomPost(subreddits);
    if (!data) {
      return sendBadRequestResponse();
    }
    return sendOKResponse(data);
  }

  if (isSubredditPath(pathnames)) {
    const feedUrl = constructRedditFeedUrl(pathnames);
    data = await parseRSSFeed(feedUrl);
    return sendOKResponse(data);
  }

  return sendBadRequestResponse();
});
