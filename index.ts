import { isSubredditPath } from './src/utils/validators.ts';
import { corsHeaders } from './src/lib/lib.ts';
import {
	logRequestBody,
	sendBadRequestResponse,
	sendOKResponse,
} from './src/utils/utils.ts';
import { handleResponse } from './src/utils/handlers.ts';
import { getReadme } from './src/utils/html.ts';

Deno.serve(async (req) => {
	logRequestBody(req);

	if (req.method !== 'GET') {
		return new Response('Method Not Allowed', { status: 405 });
	}
	const url = new URL(req.url);
	const pathnames = url.pathname.split('/').filter(Boolean);

	let data: ResponseData | ExtractedItem;

	if (pathnames.length === 0) {
		const dom = await getReadme();
		if (!dom || !dom.documentElement) {
			return sendBadRequestResponse();
		}
		const htmlContent = `<!DOCTYPE html>${dom.documentElement.outerHTML}`;

		return new Response(htmlContent, {
			headers: {
				'Content-Type': 'text/html',
				...corsHeaders,
			},
			status: 200,
			statusText: 'OK',
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
