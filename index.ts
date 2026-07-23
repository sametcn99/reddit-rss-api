import { serveDir } from '@std/http/file-server';
import { isSubredditPath } from './src/utils/validators.ts';
import { corsHeaders } from './src/lib/lib.ts';
import { sendBadRequestResponse, sendOKResponse } from './src/utils/utils.ts';
import { handleResponse } from './src/utils/handlers.ts';

Deno.serve((req) => {
	if (req.method !== 'GET') {
		return new Response('Method Not Allowed', {
			status: 405,
			headers: corsHeaders,
		});
	}

	const url = new URL(req.url);
	const pathnames = url.pathname.split('/').filter(Boolean);

	// API route: /r/{subreddits}
	if (isSubredditPath(pathnames)) {
		return handleResponse(url, pathnames)
			.then((data) => sendOKResponse(data))
			.catch((error) => sendBadRequestResponse(String(error)));
	}

	// Static files (index.html, favicon.ico, openapi.json, site.webmanifest, etc.)
	return serveDir(req, {
		fsRoot: '.',
		showDirListing: false,
		enableCors: true,
	});
});
