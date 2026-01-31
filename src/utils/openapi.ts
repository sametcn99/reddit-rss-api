export const openApiSpec = {
	'openapi': '3.0.0',
	'info': {
		'title': 'Reddit RSS API',
		'description':
			'A Deno-powered HTTP service that turns Reddit subreddit RSS feeds into structured JSON, complete with filtering, sorting, merging, and random selection utilities.\n\n### Key Features\n- **Multi-Subreddit Merging**: Consolidate multiple subreddits into a single feed.\n- **Media Filtering**: Filter by images or videos via query parameters.\n- **Flexible Sorting**: Sort items by date (`asc`, `desc`) or shuffle them (`mixed`).\n- **Zero Dependencies**: Built with Deno and TypeScript for high performance.\n\n### Quick Usage\n```bash\ncurl "https://reddit-rss-api.deno.dev/r/deno+typescript?merge=true&filter=image"\n```\n\n### Resources\n- **GitHub Repository**: [sametcn99/reddit-rss-api](https://github.com/sametcn99/reddit-rss-api)',
		'version': '1.0.0',
		'contact': {
			'name': 'sametcn99',
			'url': 'https://github.com/sametcn99/reddit-rss-api',
		},
	},
	'servers': [
		{
			'url': 'https://reddit-rss-api.deno.dev',
			'description': 'Production server',
		},
		{
			'url': 'http://localhost:8000',
			'description': 'Local development server',
		},
	],
	'paths': {
		'/r/{subreddits}': {
			'get': {
				'summary': 'Fetch RSS-derived JSON for subreddits',
				'description':
					'Fetches and processes Reddit RSS feeds for one or more subreddits with optional filtering, sorting, and merging.',
				'parameters': [
					{
						'name': 'subreddits',
						'in': 'path',
						'required': true,
						'description':
							"One or more subreddit names separated by '+' (e.g., 'deno+typescript')",
						'schema': {
							'type': 'string',
						},
					},
					{
						'name': 'option',
						'in': 'query',
						'required': false,
						'description': 'Additional operations on the feed.',
						'schema': {
							'type': 'string',
							'enum': ['random'],
						},
					},
					{
						'name': 'sort',
						'in': 'query',
						'required': false,
						'description':
							'Order items by publish date or shuffle them.',
						'schema': {
							'type': 'string',
							'enum': ['asc', 'desc', 'mixed'],
							'default': 'asc',
						},
					},
					{
						'name': 'filter',
						'in': 'query',
						'required': false,
						'description':
							"Keep only media-rich posts. Combine options with '+' (e.g., 'image+video').",
						'schema': {
							'type': 'string',
						},
					},
					{
						'name': 'merge',
						'in': 'query',
						'required': false,
						'description':
							'When true, fetches each subreddit individually and merges results.',
						'schema': {
							'type': 'boolean',
							'default': false,
						},
					},
					{
						'name': 'count',
						'in': 'query',
						'required': false,
						'description':
							'Truncate response to the first N items.',
						'schema': {
							'type': 'integer',
							'minimum': 1,
						},
					},
					{
						'name': 'old_reddit',
						'in': 'query',
						'required': false,
						'description': 'Rewrite links to use old.reddit.com.',
						'schema': {
							'type': 'boolean',
							'default': false,
						},
					},
				],
				'responses': {
					'200': {
						'description': 'Successful response',
						'content': {
							'application/json': {
								'schema': {
									'oneOf': [
										{
											'$ref':
												'#/components/schemas/ResponseData',
										},
										{
											'$ref':
												'#/components/schemas/ExtractedItem',
										},
									],
								},
							},
						},
					},
					'400': {
						'description': 'Bad Request',
						'content': {
							'text/plain': {
								'schema': {
									'type': 'string',
								},
							},
						},
					},
				},
			},
		},
	},
	'components': {
		'schemas': {
			'ResponseData': {
				'type': 'object',
				'properties': {
					'title': { 'type': 'string' },
					'lastBuildDate': {
						'type': 'string',
						'format': 'date-time',
					},
					'link': { 'type': 'string' },
					'feedUrl': { 'type': 'string' },
					'itemsLength': { 'type': 'integer' },
					'items': {
						'type': 'array',
						'items': {
							'$ref': '#/components/schemas/ExtractedItem',
						},
					},
				},
			},
			'ExtractedItem': {
				'type': 'object',
				'properties': {
					'title': { 'type': 'string' },
					'link': { 'type': 'string' },
					'author': { 'type': 'string' },
					'isoDate': { 'type': 'string', 'format': 'date-time' },
					'feedURL': { 'type': 'string' },
					'id': { 'type': 'string' },
					'message': { 'type': 'string' },
					'links': {
						'type': 'array',
						'items': { 'type': 'string' },
					},
					'images': {
						'type': 'array',
						'items': { 'type': 'string' },
					},
					'videos': {
						'type': 'array',
						'items': { 'type': 'string' },
					},
				},
			},
		},
	},
};

export const swaggerHtml = `
<!doctype html>
<html lang="en">
  <head>
    <title>Reddit RSS API | Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="A Deno-powered HTTP service that turns Reddit subreddit RSS feeds into structured JSON." />
    <meta name="keywords" content="reddit, rss, api, json, deno, documentation" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="sametcn99" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://reddit-rss-api.deno.dev/" />
    <meta property="og:title" content="Reddit RSS API | Documentation" />
    <meta property="og:description" content="A Deno-powered HTTP service that turns Reddit subreddit RSS feeds into structured JSON with filtering, sorting, and merging." />
    <meta property="og:image" content="https://reddit-rss-api.deno.dev/favicon.ico" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://reddit-rss-api.deno.dev/" />
    <meta property="twitter:title" content="Reddit RSS API | Documentation" />
    <meta property="twitter:description" content="A Deno-powered HTTP service that turns Reddit subreddit RSS feeds into structured JSON with filtering, sorting, and merging." />
    <meta property="twitter:image" content="https://reddit-rss-api.deno.dev/favicon.ico" />
    <style>
      body {
        margin: 0;
      }
    </style>
    <script defer src="https://umami.sametcc.me/script.js" data-website-id="276eaa1b-b400-4185-a887-3371fc7ee745"></script>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>
`;
