import RE2 from 're2';

const URL_EXTRACTOR = new RE2(
	'(?:http[s]?:\\/\\/.)?(?:www\\.)?[-a-zA-Z0-9@%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b(?:[-a-zA-Z0-9@:%_\\+.~#?&\\/\\/=]*)',
	'gi',
);

const UTM_MATCHER = /([?&])(yclid|gclid|utm_(source|campaign|medium|term))=[^&]+/gi;

const getRedirectedUrl = async (url: string): Promise<string | null> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 5 * 1000);

	try {
		const response = await fetch(url, {
			method: 'HEAD',
			redirect: 'manual',
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if ([301, 302].includes(response.status)) {
			const location = response.headers.get('location');
			if (location) {
				if (/^https?:\/\//.test(location)) {
					return location;
				} else {
					return new URL(location, url).toString();
				}
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
		return null;
	}
};

const getSafeBiliLink = async (url: string): Promise<string> => {
	try {
		const redirectedUrl = await getRedirectedUrl(url);
		if (!redirectedUrl) {
			return url;
		}
		if (redirectedUrl.startsWith('https://www.bilibili.com/video/BV')) {
			const parsed = new URL(redirectedUrl);
			parsed.search = '';
			return parsed.toString();
		} else {
			return redirectedUrl;
		}
	} catch (error) {
		console.warn('Cannot get redirected URL:', url, error);
		return url;
	}
};

export const getSafeXhsLink = async (url: string): Promise<string> => {
	try {
		const redirectedUrl = await getRedirectedUrl(url);
		if (!redirectedUrl) {
			return url;
		}
		if (redirectedUrl.startsWith('https://www.xiaohongshu.com/')) {
			const parsed = new URL(redirectedUrl);
			parsed.searchParams.delete('apptime');
			parsed.searchParams.delete('shareRedId');
			parsed.searchParams.delete('share_id');
			return parsed.toString();
		} else {
			return redirectedUrl;
		}
	} catch (error) {
		console.warn('Cannot get redirected URL:', url, error);
		return url;
	}
};

const getSafeNeteaseLink = async (url: string): Promise<string> => {
	try {
		const redirectedUrl = await getRedirectedUrl(url);
		if (!redirectedUrl) {
			return url;
		}
		if (redirectedUrl.startsWith('https://y.music.163.com/')) {
			const parsed = new URL(redirectedUrl);
			parsed.searchParams.delete('userid');
			parsed.searchParams.delete('app_version');
			return parsed.toString();
		}
		return redirectedUrl;
	} catch (error) {
		console.warn('Cannot get redirected URL:', url, error);
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

	console.log('urls', urls);

	let newText = noteText;

	await Promise.all(urls.map(async (url) => {
		try {
			const parsed = new URL(url);
			console.log('parsed', parsed);
			switch (parsed.hostname) {
				case 'b23.tv': {
					const safeUrl = await getSafeBiliLink(url);
					newText = newText.replace(url, safeUrl);
					break;
				}
				case 'xhslink.com': {
					const safeUrl = await getSafeXhsLink(url);
					newText = newText.replace(url, safeUrl);
					break;
				}
				case '163cn.tv': {
					const safeUrl = await getSafeNeteaseLink(url);
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

	console.log('newText', newText);

	return newText;
};
