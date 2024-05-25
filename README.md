# Overview

This project is a Deno-based server application that serves as an API for fetching Reddit posts from RSS feeds. It provides several endpoints to fetch posts from one or more subreddits.

## API Endpoints

Here is a list of URLs with their corresponding descriptions:

1. **Multi Feed**
   - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes](https://reddit-rss-api.deno.dev/r/memes+dankmemes)

2. **Single Feed**
   - URL: [https://reddit-rss-api.deno.dev/r/memes](https://reddit-rss-api.deno.dev/r/memes)

3. **Home**
   - URL: [https://reddit-rss-api.deno.dev](https://reddit-rss-api.deno.dev)

4. **Random Post**
   - URL: [https://reddit-rss-api.deno.dev/r/memes?option=random](https://reddit-rss-api.deno.dev/r/memes?option=random)
   - Query Params: 
     - `option`: `random`

5. **Sort Descending**
   - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=desc)
   - Query Params:
     - `sort`: `desc`

6. **Sort Ascending**
   - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc](https://reddit-rss-api.deno.dev/r/memes+dankmemes?sort=asc)
   - Query Params:
     - `sort`: `asc`

7. **Filter Image**
   - URL: [https://reddit-rss-api.deno.dev/r/turkey?filter=image](https://reddit-rss-api.deno.dev/r/turkey?filter=image)
   - Query Params:
     - `filter`: `image`

8. **Random Image Post**
   - URL: [https://reddit-rss-api.deno.dev/r/turkey?filter=image&option=random](https://reddit-rss-api.deno.dev/r/turkey?filter=image&option=random)
   - Query Params:
     - `filter`: `image`
     - `option`: `random`

9. **Merged Feeds**
   - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true](https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true)
   - Query Params:
     - `merge`: `true`

10. **Random Post from Merged**
    - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&option=random](https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&option=random)
    - Query Params:
      - `merge`: `true`
      - `option`: `random`

11. **Random Image Post from Merged**
    - URL: [http://localhost:8000/r/memes+dankmemes?filter=image&option=random&merge=true](http://localhost:8000/r/memes+dankmemes?filter=image&option=random&merge=true)
    - Query Params:
      - `merge`: `true`
      - `option`: `random`
      - `filter`: `image`

12. **Filter Image from Merged**
    - URL: [https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&filter=image](https://reddit-rss-api.deno.dev/r/memes+dankmemes+turkey?merge=true&filter=image)
    - Query Params:
      - `merge`: `true`
      - `filter`: `image`
  
### Query Parameters

- **option**: This query parameter can be set to `random` to fetch a random post from the specified subreddit(s).
- **sort**: This query parameter can be set to `mixed`, `asc` or `desc` to sort the specified subreddit(s).
- **filter**: This query parameter can be set to `image` to get image posts from feeds.
- **merge**: This query parameter can be set `true` or `false` to merge items from multiple subreddits, which is useful for getting more posts from feeds.

[Source Code](https://github.com/sametcn99/reddit-rss-api)
