import { observable } from "mobx";
import * as Engine from './engine'

class AppState {
	@observable game: Engine.Game
	startGame = async (folder: string, save: string) => {
		const game = !save ? await Engine.newGame(folder) : await Engine.loadGame(folder, save);
		(window as any).game = game;
		await game.beginGame();
		this.game = game;
	}
}

export default new AppState()