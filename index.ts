import { isSubredditPath } from "./src/utils/validators.ts";
import { constructRedditFeedUrl } from "./src/utils/validators.ts";
import { corsHeaders } from "./src/lib/lib.ts";
import { parseRSSFeed } from "./src/utils/fetch.ts";
import { logRequestBody, sendBadRequestResponse } from "./src/utils/utils.ts";

Deno.serve(async (req) => {
  logRequestBody(req);

  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const pathnames = url.pathname.split("/").filter(Boolean);

  let data: ResponseData[] | ResponseData;

  if (isSubredditPath(pathnames)) {
    const feedUrl = constructRedditFeedUrl(pathnames);
    data = await parseRSSFeed(feedUrl);

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
      status: 200,
      statusText: "OK",
    });
  }

  return sendBadRequestResponse();
});
