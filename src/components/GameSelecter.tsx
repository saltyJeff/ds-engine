import * as React from 'react';
import AppState from '../AppState';

export default class GameSelecter extends React.Component<{}, {
	folder: string
}> {
	constructor (props) {
		super(props)
		this.state = {
			folder: 'demo'
		};
	}
	render () {
		return (
			<div className="GameSelecter">
				<h1>Game folder:</h1>
				<input type="text" value={this.state.folder} onChange={(e) => this.setState({folder: e.currentTarget.value})}/>
				<br/>
				<br />
				<button onClick={this.loadGame}>LOAD SAVE</button>
				<br />
				<br />
				<button onClick={this.newGame}>NEW GAME</button>
				<br />
				<br />
				{!!localStorage.getItem('gameSave') && <div>
					<h2>Saved game detected</h2>
					<pre>
						{localStorage.getItem('gameSave')}
					</pre>
				</div>}
			</div>
		)
	}
	loadGame = () => {
		AppState.startGame(this.state.folder, localStorage.getItem('gameSave'));
	}
	newGame = () => {
		localStorage.setItem('gameSave', '');
		this.loadGame();
	}
}