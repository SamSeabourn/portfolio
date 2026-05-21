export const getRuntimeStats = async (): Promise<string> => {
	let clsScore = 0;
	let lcpValue = 0;
	let tbtValue = 0;

	const clsObserver = new PerformanceObserver((list) => {
		for (const entry of list.getEntries() as any[]) {
			if (!entry.hadRecentInput) {
				clsScore += entry.value;
			}
		}
	});

	try {
		clsObserver.observe({ type: 'layout-shift', buffered: true });
	} catch {
		console.warn('CLS observation not supported');
	}

	const lcpObserver = new PerformanceObserver((list) => {
		const entries = list.getEntries();
		const lastEntry = entries[entries.length - 1] as any;
		lcpValue = lastEntry.startTime;
	});

	try {
		lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
	} catch {
		console.warn('LCP observation not supported');
	}

	const tbtObserver = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			if (entry.duration > 50) {
				tbtValue += entry.duration - 50;
			}
		}
	});

	try {
		tbtObserver.observe({ type: 'longtask', buffered: true });
	} catch {
		console.warn('Long task observation not supported');
	}

	const connection = (navigator as any).connection;
	const net = connection?.effectiveType ?? 'unknown';

	await new Promise<void>((res) => {
		if (document.readyState === 'complete') {
			res();
		} else {
			window.addEventListener('load', () => { res(); }, { once: true });
		}
	});

	await new Promise<void>((res) => { setTimeout(res, 500); });

	clsObserver.disconnect();
	lcpObserver.disconnect();
	tbtObserver.disconnect();

	const formatTime = (ms: number) => {
		const seconds = (ms / 1000).toFixed(2);
		return seconds.padStart(6, '0') + 's  ';
	};

	const formatMs = (ms: number) => {
		const rounded = Math.round(ms);
		return rounded.toString().padStart(3, '0') + 'ms    ';
	};

	const formatCls = (score: number) => {
		return score.toFixed(3).padStart(5, '0') + '   ';
	};

	const formatNet = (n: string) => {
		return n.padEnd(8, ' ');
	};

	return [
		`LCP: ${formatTime(lcpValue)}`,
		`TBT: ${formatMs(tbtValue)}`,
		`CLS: ${formatCls(clsScore)}`,
		`NET: ${formatNet(net)}`,
	].join('\n');
};
