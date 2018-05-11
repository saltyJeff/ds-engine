import * as path from 'path';
import * as yaml from 'js-yaml';
import { observable } from 'mobx';
import { Scene } from './Scene';
import { Character } from './Character';
import { GameSave } from './GameSave';

export class Game {
	@observable engineVersion: string;
	@observable name: string;
	@observable scenes: string[];
	@observable player: any;
	@observable rootUrl: string;
	@observable version: string;
	@observable info: string;
	cachedScenes: {[key: string]: Scene} = {};
	@observable currentScene: Scene;
	private save: GameSave;
	private evalCtxt: {
		player: any;
		scene: string;
	};
	constructor(storyData: any, save?: GameSave) {
		Object.assign(this, storyData)
		this.evalCtxt = {
			player: this.player,
			scene: this.scenes[0]
		};
		this.save = save || {} as any;
		console.log(save);
	}
	beginGame = async () => {
		if(!this.save.currentSceneName) {
			await this.transitionScene(this.scenes[0]);
		}
		else {
			const sceneName = this.save.currentSceneName;
			this.save.currentSceneName = null;
			await this.transitionScene(sceneName);
		}
	}
	transitionScene = async (sceneName: string): Promise<Scene> => {
		console.log('changing scene to: '+sceneName);
		if(this.cachedScenes[sceneName] == null) {
			if(this.scenes.indexOf(sceneName) == -1) {
				throw new Error(`Invalid story: scene ${sceneName} not found`)
			}
			console.log('Caching: '+sceneName);
			const sceneUrl = path.join(this.rootUrl, sceneName, 'info.yml');
			const sceneInfoYml = await (await fetch(sceneUrl)).text();
			const sceneInfo: any = yaml.safeLoad(sceneInfoYml);
			sceneInfo.sceneUrl = path.join(this.rootUrl, sceneName);
			sceneInfo.canonicalName = sceneName;
			this.cachedScenes[sceneName] = new Scene(sceneInfo, this, this.save);
		}
		this.evalCtxt.scene = sceneName;	
		await this.cachedScenes[sceneName].execScene();
		this.currentScene = this.cachedScenes[sceneName];
		return this.currentScene;
	}
	hasScene = (sceneName: string) => {
		return this.scenes.indexOf(sceneName) != -1;
	}
	//arbitrary execution of remote code: what could go wrong?
	evalInCtxt = (evalStr: string) => {
		//kicking it like it's es3
		console.log('evaluating: '+evalStr);
		console.log(this.evalCtxt);
		return (function () {
			return eval(evalStr)
		}).call(this.evalCtxt);
	}
	getSave = () => {
		return yaml.safeDump(new GameSave(this));
	}
}