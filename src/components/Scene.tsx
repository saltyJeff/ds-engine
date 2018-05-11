import * as React from 'react';
import * as Engine from '../engine';

import AppState from '../AppState';
import CharTxt from './CharTxt';
import Options from './Options';
import { observer } from 'mobx-react';

@observer
export default class Scene extends React.Component<{
	scene: Engine.Scene
}, {
	diagCmplt: boolean;
}> {
	constructor (props) {
		super(props);
		this.state = {
			diagCmplt: false
		}
	}
	render() {
		document.body.style.backgroundImage = `url(${this.props.scene.background})`;
		return (
			<div className="Scene">
				<h1 className="sceneTitle">{this.props.scene.name}</h1>
				<div className="viewPort">
					<img className="portrait" src={this.props.scene.currentCharacter.img}/>
				</div>
				<audio src={this.props.scene.audio} autoPlay loop></audio>
				<audio src={this.props.scene.currentCharacter.audio} autoPlay loop></audio>
				<div className="textPort">
				<u>{this.props.scene.currentCharacter.name}</u>
				{
					!this.state.diagCmplt ? 
					<CharTxt 
						dialog={this.props.scene.currentCharacter.currentState.dialog} 
						onComplete={() => this.setState({diagCmplt: true})}/> :
					<Options 
						options={this.props.scene.currentCharacter.currentState.possibleOpts}
						onSelect={(index: number) => {
							this.setState({diagCmplt: false});
							this.props.scene.currentCharacter.takeOption(index);
						}}/>
				}
				</div>
			</div>
		)
	}
}
