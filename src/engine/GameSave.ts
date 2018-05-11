import { Game } from './Game'
import { toJS } from 'mobx';
export class GameSave {
	player: any;
	currentSceneName: string;
	currentCharacterName: string;
	currentStateName: string;
	inits: string[] = [];
	constructor(game: Game) {
		this.player = toJS(game.player);
		this.currentSceneName = toJS(game.currentScene.canonicalName);
		this.currentCharacterName = toJS(game.currentScene.currentCharacter.canonicalName);
		this.currentStateName = toJS(game.currentScene.currentCharacter.currentStateName);
		for(let sceneName in game.cachedScenes) {
			if(!game.cachedScenes.hasOwnProperty(sceneName)) {
				continue;
			}
			const scene = game.cachedScenes[sceneName];
			if(scene.initiated) {
				this.inits.push(sceneName);
			}
			for(let charName in scene.cachedCharacters) {
				if(!scene.cachedCharacters.hasOwnProperty(charName)) {
					continue;
				}
				const char = scene.cachedCharacters[charName];
				for(let stateName in char.states) {
					if(!char.states.hasOwnProperty(stateName)) {
						continue;
					}
					const state = char.states[stateName];
					if(state.initiated) {
						this.inits.push(`${sceneName}.${charName}.${stateName}`);
					}
				}
			}
		}
	}
}