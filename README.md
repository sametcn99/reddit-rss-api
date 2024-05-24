# Overview

This project appears to be a Deno-based server application that serves as an API for fetching Reddit posts from rss feed. It provides several endpoints to fetch posts from one or more subreddits.

## API Endpoints

Sure, here is the list of URLs with their corresponding descriptions:

1. **Multi Feed**
   - URL: `https://reddit-rss-api.deno.dev/r/memes+dankmemes`

2. **Single Feed**
   - URL: `https://reddit-rss-api.deno.dev/r/memes`

3. **Home**
   - URL: `https://reddit-rss-api.deno.dev`

4. **Random Post**
   - URL: `https://reddit-rss-api.deno.dev/r/memes?option=random`
   - Query Params: 
     - `option`: `random`

5. **Sort Descending**
   - URL: `https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc`
   - Query Params:
     - `sort`: `desc`

6. **Sort Ascending**
   - URL: `https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc`
   - Query Params:
     - `sort`: `asc`

7. **Filter Image**
   - URL: `https://reddit-rss-api.deno.dev/r/turkey?filter=image`
   - Query Params:
     - `filter`: `image`

8. **Random Image Post**
   - URL: `https://reddit-rss-api.deno.dev/r/turkey?filter=image&option=random`
   - Query Params:
     - `filter`: `image`
     - `option`: `random`

9. **Merged Feeds**
   - URL: `https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true`
   - Query Params:
     - `merge`: `true`

10. **Random Post from Merged**
    - URL: `https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&option=random`
    - Query Params:
      - `merge`: `true`
      - `option`: `random`

11. **Filter Image from Merged**
    - URL: `https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&filter=image`
    - Query Params:
      - `merge`: `true`
      - `filter`: `image`
  
### Query Parameters

- **option**: This query parameter can be set to `random` to fetch a random post from the specified subreddit(s).
- **sort**: This query parameter can be sort asc or desc specified subreddit(s).
- **filter**: Get Image Posts from feeds.
- **merge**: This query paramater can be merge items from multiple subreddit(s). Usefull for getting more posts from feeds.

[Source Code](https://github.com/sametcn99/reddit-rss-api)
