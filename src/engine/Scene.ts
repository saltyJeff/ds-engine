import * as path from 'path';
import * as yaml from 'js-yaml';
import { observable } from 'mobx';
import { Character } from './Character';
import { Game } from './Game';
import { urljoin } from './urljoin';
import { GameSave } from './GameSave';

export class Scene {
	@observable name: string;
	canonicalName: string;
	@observable background: string;
	@observable characters: string[];
	cachedCharacters: {[key: string]: Character} = {};
	@observable currentCharacter: Character;
	@observable init?: string;
	@observable eval?: string;
	initiated = false;
	@observable game: Game;
	@observable sceneUrl: string;
	@observable audio?: string;
	private save: GameSave;
	constructor(sceneData: any, game: Game, save?: GameSave) {
		Object.assign(this, sceneData);
		this.game = game;
		this.background = urljoin(this.sceneUrl, this.background);
		this.audio = urljoin(this.sceneUrl, this.audio);
		this.save = save;
		console.log(save);
		this.initiated = !!save.inits && save.inits.indexOf(this.canonicalName) == -1;
	}
	execScene = async () => {
		await this.prepScenes();
		if(!this.save.currentCharacterName) {
			this.transitionCharacter(this.characters[0]);
		}
		else {
			const charName = this.save.currentCharacterName;
			this.save.currentCharacterName = null;
			this.transitionCharacter(charName);
		}
	}
	//ALWAYS CALL BEFORE TRANSITIONING ANY CHARACTERS
	private prepScenes = async () => {
		for(let charName of this.characters) {
			const charUrl = path.join(this.sceneUrl, charName+'.yml');
			const charYml = await (await fetch(charUrl)).text();
			const charInfo: any = yaml.safeLoad(charYml);
			charInfo.canonicalName = charName;
			this.cachedCharacters[charName] = new Character(charInfo, this , this.save);
		}
		console.log('cached characters:');
		console.log(this.cachedCharacters);
		if(!this.initiated) {
			if(this.init) {
				this.game.evalInCtxt(this.init);
			}
			this.initiated = true;
		}
	}
	transitionCharacter = (charName: string) => {
		console.log('changing character to: '+charName);
		const nextChar = this.cachedCharacters[charName];
		if(!nextChar) {
			throw new Error(`Invalid story: character ${charName} not found`)
		}
		nextChar.runCharacter();
		this.currentCharacter = nextChar;
	}
	hasCharacter = (charName: string) => {
		return this.cachedCharacters[charName] != null;
	}
}