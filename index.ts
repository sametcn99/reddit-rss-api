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
import { getQueryParams } from "./src/utils/handlers.ts";
import { handleResponse } from "./src/utils/handlers.ts";

Deno.serve(async (req) => {
  logRequestBody(req);

  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const url = new URL(req.url);
  const pathnames = url.pathname.split("/").filter(Boolean);

  let data: ResponseData | ExtractedItem;

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
    const { merge } = getQueryParams(url);
    if (merge === "true") {
      const feedUrls = constrsuctMergedFeedUrls(pathnames[1]);
      data = await mergedSubreddits(feedUrls, pathnames[1]);
      data = await handleResponse(url, feedUrl, data);
      return sendOKResponse(data);
    }
    data = await parseRSSFeed(feedUrl);
    data = await handleResponse(url, feedUrl, data);
    return sendOKResponse(data);
  }
  return sendBadRequestResponse();
});
