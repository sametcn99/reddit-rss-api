import { isSubredditPath } from "./src/utils/validators.ts";
import { constructRedditFeedUrl } from "./src/utils/validators.ts";
import { corsHeaders } from "./src/lib/lib.ts";
import { parseRSSFeed } from "./src/utils/fetch.ts";
import {
  logRequestBody,
  getReadme,
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
    if (option === "random") {
      const data = await getRandomPost(pathnames[1].split("+"));
      return sendOKResponse(data);
    }
    data = await parseRSSFeed(feedUrl);
    return sendOKResponse(data);
  }

  return sendBadRequestResponse();
});
