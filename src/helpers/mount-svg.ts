export async function mountSVG(target: any, url: string): Promise<void> {
	if (!target || !(target instanceof SVGElement)) {
		console.error('mountSVG: target must be an SVGElement');
		return;
	}
	if (!url || typeof url !== 'string') {
		console.error('mountSVG: url must be a non-empty string');
		return;
	}

	const response = await fetch(url);
	if (!response.ok) {
		console.error(
			`mountSVG: Failed to fetch ${url} - ${response.status} ${response.statusText}`
		);
		return;
	}

	const svgText = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgText, 'image/svg+xml');

	const parserError = doc.querySelector('parsererror');
	if (parserError) {
		console.error(`mountSVG: Invalid SVG content from ${url}`);
		return
	}

	const sourceSVG = doc.querySelector('svg');
	if (!sourceSVG) {
		console.error(`mountSVG: No <svg> element found in ${url}`);
		return
	}

	const preservedAttrs = new Map<string, string>();
	Array.from(target.attributes).forEach((attr) => {
		preservedAttrs.set(attr.name, attr.value);
	});

	target.innerHTML = sourceSVG.innerHTML;

	const criticalAttrs = ['viewBox', 'preserveAspectRatio', 'xmlns'];
	criticalAttrs.forEach((attrName) => {
		if (sourceSVG.hasAttribute(attrName) && !preservedAttrs.has(attrName)) {
			target.setAttribute(attrName, sourceSVG.getAttribute(attrName)!);
		}
	});

	preservedAttrs.forEach((value, name) => {
		target.setAttribute(name, value);
	});

	target.setAttribute('data-mounted', 'true');
}
