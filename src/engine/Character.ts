import * as path from 'path';
import * as yaml from 'js-yaml';
import { observable } from 'mobx';
import { urljoin } from './urljoin';
import { Scene } from './Scene';
import { Game } from './Game';
import { GameSave } from './GameSave';

export class Character {
	@observable name: string;
	canonicalName: string;
	@observable img: string;
	states: {[key: string]: State} = {};
	@observable currentState: State;
	currentStateName: string;
	@observable scene: Scene;
	@observable audio: string;
	save: GameSave;
	constructor(charData: any, scene: Scene, save?: GameSave) {
		Object.assign(this, charData);
		this.scene = scene;
		this.img = urljoin(this.scene.sceneUrl, this.img);
		this.save = save;
		if(!!save.inits) {
			for(let reference of save.inits) {
				const [sceneName, charName, stateName] = reference.split('.');
				if(sceneName == this.scene.canonicalName && charName == this.canonicalName) {
					this.states[stateName].initiated = true;
				}
			}
		}
		this.audio = urljoin(this.scene.sceneUrl, this.audio);
	}
	runCharacter = () => {
		if(!this.save.currentStateName) {
			this.transitionState('START');
		}
		else {
			const stateName = this.save.currentStateName;
			this.save.currentStateName = null;
			this.transitionState(stateName);
		}
	}
	transitionState = (stateName: string) => {
		console.log('changing state to: '+stateName);
		if(!this.states[stateName]) {
			throw new Error(`Invalid story: state ${stateName} not found`);
		}
		this.currentState = Object.assign({}, this.states[stateName]) //shallow copy
		this.currentState.possibleOpts = this.currentState.options.filter((opt: Option) => {
			return opt.conditional == null ||
			this.scene.game.evalInCtxt(opt.conditional)
		})
		this.currentStateName = stateName;
		if(this.currentState.init && !this.currentState.initiated) {
			this.currentState.initiated = true;
			this.scene.game.evalInCtxt(this.currentState.init);
		}
		if(this.currentState.eval) {
			this.scene.game.evalInCtxt(this.currentState.eval);
		}
		if(this.currentState.img) {
			if(!absoluteUrl(this.currentState.img)) {
				this.currentState.img = path.join(this.scene.sceneUrl, this.currentState.img);
			}
			this.img = this.currentState.img;
		}
	}
	takeOption = async (optIdx: number) => {
		const opt = this.currentState.possibleOpts[optIdx];
		if(opt.eval) {
			this.scene.game.evalInCtxt(opt.eval);
		}
		//resolve the goto parameter
		//start to see if current character has a state with the goto
		if(this.hasState(opt.goto)) {
			this.transitionState(opt.goto);
		}
		else {
			//tokenize around the dot
			const [first, second, third] = opt.goto.split('.');
			//see if there's a character in the scene with first
			if(this.scene.hasCharacter(first)) {
				this.scene.transitionCharacter(first);
				if(second) { //check for state jump
					this.scene.currentCharacter.transitionState(second);
				}
				else { //or run default state
					this.scene.currentCharacter.runCharacter();
				}
			}
			//see if there's a scene with first
			else if(this.scene.game.hasScene(first)) {
				const newScene = await this.scene.game.transitionScene(first);
				 if(second) { //check for character jump
					newScene.transitionCharacter(second);
					if(third) { //check for state jump
						newScene.currentCharacter.transitionState(third);
					}
					else {
						newScene.currentCharacter.runCharacter();
					}
				 }
				 else {
					newScene.execScene();
				 }
			}
			else {
				throw new Error(`${opt.goto} cannot be resolved to a state, a character, or a scene`);
			}
		}
	}
	hasState = (stateName: string) => {
		return this.states[stateName] != null;
	}
}
export class State {
	@observable dialog: string | string[];
	@observable eval?: string;
	@observable init?: string;
	initiated: boolean = false;
	@observable options: Option[];
	@observable possibleOpts: Option[];
	@observable img?: string;
}
export class Option {
	@observable text: string;
	@observable goto: string;
	@observable conditional?: string;
	@observable eval?: string;
}
function absoluteUrl(urlStr: string) {
	return urlStr.indexOf('http://') === 0 || urlStr.indexOf('https://') === 0;
}