import RE2 from 're2';

const URL_EXTRACTOR = new RE2(
	'(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)',
	'gi',
);

const UTM_MATCHER = /([?&])(yclid|gclid|utm_(source|campaign|medium|term))=[^&]+/gi;

const getSafeBiliLink = async (url: string): Promise<string> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 3000);

	try {
		const response = await fetch(url, {
			method: 'HEAD',
			redirect: 'manual',
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (response.status === 302) {
			const location = response.headers.get('location');
			if (location) {
				const redirectUrl = new URL(location, url);
				if (redirectUrl.href.startsWith('https://www.bilibili.com/video/BV')) {
					redirectUrl.search = '';
					return redirectUrl.toString();
				}
				if (redirectUrl.searchParams.has('mid')) {
					redirectUrl.searchParams.delete('mid');
				}
				return redirectUrl.toString();
			}
		}

		return url;
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				console.warn('Request timed out');
			} else {
				console.error('Error occurred:', error);
			}
		}
		return url;
	}
};

/**
 * Clean the UTM things in the link
 * @param noteText The original note text
 * @returns cleaned text
 */
export const cleanLink = async (noteText: string) => {
	// extract url with re2 in the originalText
	const urls: string[] = [];
	let match: RegExpExecArray | null;

	while ((match = URL_EXTRACTOR.exec(noteText)) !== null) {
		urls.push(match[0]);
	}

	let newText = noteText;

	await Promise.all(urls.map(async (url) => {
		try {
			const parsed = new URL(url);
			switch (parsed.hostname) {
				case 'b23.tv': {
					const safeUrl = await getSafeBiliLink(url);
					newText = newText.replace(url, safeUrl);
					break;
				}
				default: {
					const safeUrl = url.replace(UTM_MATCHER, '');
					if (safeUrl === url) {
						break;
					} else {
						newText = newText.replace(url, safeUrl);
					}
					break;
				}
			}
		} catch (error) {
			console.warn('Cannot parse URL in the note text:', url, error);
		}
	}));

	return newText;
};
