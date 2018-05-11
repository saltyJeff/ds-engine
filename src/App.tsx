import * as React from 'react'
import {observer} from 'mobx-react'
import './App.css'
import './obvious-buttons.css'

import GameSelecter from './components/GameSelecter'
import GamePlayer from './components/GamePlayer'
import AppState from './AppState'

@observer
export default class App extends React.Component {
	constructor (props) {
		super(props)
	}
	render() {
		return (
			<div className="App">
				{AppState.game == null ? <GameSelecter /> : <GamePlayer />}
			</div>
		);
	}
}
