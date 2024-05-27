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
    const dom = await getReadme();
    if (!dom || !dom.documentElement) {
      return sendBadRequestResponse();
    }
    const htmlContent = dom.documentElement.outerHTML;

    return new Response(htmlContent, {
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
    try {
      data = await handleResponse(url, feedUrl, pathnames);
      return sendOKResponse(data);
    } catch (error) {
      return sendBadRequestResponse();
    }
  }
  return sendBadRequestResponse();
});
