import { Spine } from '@esotericsoftware/spine-pixi-v7';
import { Assets } from 'pixi.js';

export const createDinoSpine = async () => {
	await Assets.load('/spine/rex.skel');
	await Assets.load('/spine/rex.atlas');
	const spine = Spine.from({
		skeleton: '/spine/rex.skel',
		atlas: '/spine/rex.atlas',
	});

	return spine;
};
