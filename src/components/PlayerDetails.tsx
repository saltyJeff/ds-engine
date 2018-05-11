import * as React from 'react';
import { observer } from 'mobx-react';
import Sidebar from 'react-sidebar';
import AppState from '../AppState';
import { MouseEvent } from 'react';

@observer
export default class PlayerDetails extends React.Component<{}, {
	menuOpen: boolean;
	anchor: HTMLAnchorElement;
}> {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
			anchor: this.getAnchor()
		}
	}
	getAnchor = (): HTMLAnchorElement => {
		let a: HTMLAnchorElement = document.querySelector('a');
		if(!a) {
			a = document.createElement('a');
			a.download = "gamesave.yml";
			document.body.appendChild(a);
		}
		return a;
	}
	render () {
		return (
			<div>
				<a 
					className="button button-medium button-success button-inline menuButton"
					onClick={() => {
						this.setState({menuOpen: true})
					}}>Status</a>
				<div
					className={'sidenav '+(this.state.menuOpen ? 'menuOpened' : 'menuClosed')}>
					<a 
						href="javascript:void(0)" 
						className="closebtn" 
						onClick={() => {
							this.setState({menuOpen: false})
						}}>&times;</a>
					{
						Object.keys(AppState.game.player).map((key, i) => {
							if(key == '_') {
								return;
							}
							return (
								<p className="playerStatus" key={i}>{`${key}:\t${AppState.game.player[key]} `}</p>
							)
						})
					}
					<div className="menuBar">
						<a 
							className="button button-medium button-warning button-inline menuButton"
							onClick={this.downloadSave}>Save Game</a>
						<a 
							className="button button-medium button-inverse button-inline menuButton"
							onClick={this.showInfo}>&#9432;</a>
					</div>
				</div>
			</div>
		)
	}
	downloadSave = (e: MouseEvent<HTMLAnchorElement>) => {
		localStorage.setItem('gameSave', AppState.game.getSave());
	}
	showInfo = () => {
		window.alert(AppState.game.info);
	}
}