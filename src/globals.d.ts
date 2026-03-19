interface AnimateSvgPathOptions {
	duration?: number;
	timingFunction?: string;
	steps?: number;
	sequencePaths?: boolean;
}

interface CreateFirstInteractionListenerOptions {
	events?: string[];
	delay?: boolean;
}

declare global {
	interface Window {
		handDrawnSVGIndex: number;
		animateSvgPath: (element: any, options?: AnimateSvgPathOptions) => Promise<void>;
		mountSVG: (target: SVGElement, url: string) => Promise<void>;
		createFirstInteractionListener: (
			callback: () => void,
			options?: CreateFirstInteractionListenerOptions
		) => () => void;
		trexStomp: () => void;
	}
}

export {};
