import { isSubredditPath } from './src/utils/validators.ts';
import { corsHeaders } from './src/lib/lib.ts';
import {
	logRequestBody,
	sendBadRequestResponse,
	sendOKResponse,
} from './src/utils/utils.ts';
import { handleResponse } from './src/utils/handlers.ts';
import openApiSpec from './openapi.json' with { type: 'json' };

const swaggerHtml = await Deno.readTextFile('./index.html');

Deno.serve(async (req) => {
	logRequestBody(req);

	if (req.method !== 'GET') {
		return new Response('Method Not Allowed', { status: 405 });
	}
	const url = new URL(req.url);
	const pathnames = url.pathname.split('/').filter(Boolean);

	if (url.pathname === '/openapi.json') {
		return new Response(JSON.stringify(openApiSpec), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders,
			},
			status: 200,
		});
	}

	if (url.pathname === '/favicon.ico') {
		const icon = await Deno.readFile('./src/favicon.ico');
		return new Response(icon, {
			headers: {
				'Content-Type': 'image/x-icon',
				...corsHeaders,
			},
			status: 200,
		});
	}

	let data: ResponseData | ExtractedItem;

	if (pathnames.length === 0) {
		return new Response(swaggerHtml, {
			headers: {
				'Content-Type': 'text/html',
				...corsHeaders,
			},
			status: 200,
		});
	}

	if (isSubredditPath(pathnames)) {
		try {
			data = await handleResponse(url, pathnames);
			return sendOKResponse(data);
		} catch (error) {
			return sendBadRequestResponse(String(error));
		}
	}
	return sendBadRequestResponse('Bad Request. Invalid path.');
});
