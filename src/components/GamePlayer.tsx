import * as React from 'react';
import * as Engine from '../engine'
import Scene from './Scene'
import PlayerDetails from './PlayerDetails';

import AppState from '../AppState'
import { observer } from 'mobx-react';

@observer
export default class GamePlayer extends React.Component<{}, {}> {
	constructor(props) {
		super(props);
	}
	render () {
		return (
			<div className="GamePlayer">
				<PlayerDetails />
				{AppState.game.currentScene != null && <Scene scene={AppState.game.currentScene} />}
			</div>
		)
	}
}