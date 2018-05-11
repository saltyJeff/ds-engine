import * as path from 'path';
import * as yaml from 'js-yaml';
import { observable } from 'mobx';
import { Game } from './Game';
import { Scene } from './Scene';
import { GameSave } from './GameSave';
import { Character, State, Option } from './Character';

//TODO: async eager fetch
export async function newGame(storyUrl: string): Promise<Game> {
	console.log('loading new game');
	const storyInfoUrl = path.join(storyUrl, 'info.yml');
	const storyInfoYml = await (await fetch(storyInfoUrl)).text();
	const storyInfo: any = yaml.safeLoad(storyInfoYml);
	storyInfo.rootUrl = storyUrl;
	return new Game(storyInfo);
}
export async function loadGame(storyUrl: string, save: string): Promise<Game> {
	console.log('loading saved game');
	const gameSave = yaml.safeLoad(save) as GameSave;
	const storyInfoUrl = path.join(storyUrl, 'info.yml');
	const storyInfoYml = await (await fetch(storyInfoUrl)).text();
	const storyInfo: any = yaml.safeLoad(storyInfoYml);
	storyInfo.rootUrl = storyUrl;
	return new Game(storyInfo, gameSave);
}

export { Game, Scene, Character, State, Option }