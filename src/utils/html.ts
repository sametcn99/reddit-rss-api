import { Marked } from 'npm:@ts-stack/markdown';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts';

/**
 * Retrieves the content of the README.md file, parses it as HTML, and adds additional elements and styles.
 * @returns The parsed HTML content with added elements and styles.
 */
export async function getReadme() {
	const ENCODING = 'utf-8';
	const README_PATH = 'README.md';
	const textDecoder = new TextDecoder(ENCODING);
	const readmeContent = await Deno.readFile(README_PATH);
	const decodedReadmeContent = textDecoder.decode(readmeContent);

	const parsedHtml = parseHtml(decodedReadmeContent) as unknown as Document;
	const dom = await getIndexHtml();
	dom.body.innerHTML = parsedHtml.body.innerHTML;
	return dom;
}

export async function getIndexHtml() {
	const index = await Deno.readFile('index.html');
	const textDecoder = new TextDecoder('utf-8');
	const decodedIndex = textDecoder.decode(index);
	return parseHtml(decodedIndex) as unknown as Document;
}

/**
 * Parses the given HTML content and returns the parsed HTML document.
 *
 * @param content - The HTML content to parse.
 * @returns The parsed HTML document.
 * @throws An error if the content fails to parse.
 */
function parseHtml(content: string) {
	const htmlContent = Marked.parse(content);
	const domParser = new DOMParser();
	const parsedHtml = domParser.parseFromString(htmlContent, 'text/html');
	if (!parsedHtml) {
		throw new Error(`Failed to parse the content.`);
	}
	return parsedHtml;
}
