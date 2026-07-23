import { serveDir } from '@std/http/file-server';
import { isSubredditPath } from './src/utils/validators.ts';
import { corsHeaders } from './src/lib/lib.ts';
import {
	sendBadRequestResponse,
	sendOKResponse,
	TimeoutError,
	UpstreamError,
} from './src/utils/utils.ts';
import { handleResponse } from './src/utils/handlers.ts';

function sendErrorResponse(error: unknown): Response {
	if (error instanceof UpstreamError) {
		return new Response(String(error), {
			status: 502,
			headers: { 'Content-Type': 'text/plain', ...corsHeaders },
		});
	}
	if (error instanceof TimeoutError) {
		return new Response(String(error), {
			status: 504,
			headers: { 'Content-Type': 'text/plain', ...corsHeaders },
		});
	}
	return sendBadRequestResponse(String(error));
}

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
			.catch((error) => sendErrorResponse(error));
	}

	// Static files (index.html, favicon.ico, openapi.json, site.webmanifest, etc.)
	return serveDir(req, {
		fsRoot: '.',
		showDirListing: false,
		enableCors: true,
	});
});
