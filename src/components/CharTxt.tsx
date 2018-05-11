import * as React from 'react';
import { observer } from 'mobx-react';
import { isObservableArray } from 'mobx';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
interface CharTxtProps {
	dialog: string | string[];
	onComplete: () => void;
}
interface CharTxtState {
	goalBlock: string;
	blockIdx: number;
	currentTxt: string;
	diagIsArray: boolean;
}

export default class CharTxt extends React.Component<CharTxtProps, CharTxtState> {
	constructor(props) {
		super(props);
		this.state = CharTxt.getDerivedStateFromProps(props, {} as any);
	}
	static getDerivedStateFromProps(newProps: CharTxtProps, prevState: CharTxtState): CharTxtState {
		const diagIsArray = isObservableArray(newProps.dialog);
		return {
			diagIsArray: diagIsArray,
			goalBlock: (diagIsArray ? newProps.dialog[0] : newProps.dialog) as string,
			blockIdx: 0,
			currentTxt: "",
		}
	}
	drawTxt = async () => {
		while(this.state.currentTxt.length < this.state.goalBlock.length) {
			const newChar = this.state.goalBlock[this.state.currentTxt.length];
			this.setState({currentTxt: this.state.currentTxt+newChar});
			await sleep(70);
		}
	}
	componentDidMount () {
		this.drawTxt();
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if(e.keyCode == 13) {
				this.continueStory();	
			}
		})
	}
	continueStory = () => {
		if(this.state.diagIsArray && this.state.blockIdx < this.props.dialog.length) {
			const newIdx = this.state.blockIdx+1;
			if(newIdx >= this.props.dialog.length) {
				this.props.onComplete();
				return;
			}
			this.setState({
				blockIdx: newIdx,
				goalBlock: this.props.dialog[newIdx],
				currentTxt: ""
			}, this.drawTxt);
		}
		else {
			this.props.onComplete();
		}
	}
	render () {
		return (
			<div className="CharTxt">
				<p 
					onClick={() => {
						this.setState({currentTxt: this.state.goalBlock})
					}}>
					{this.state.currentTxt}
				</p>
				{
					this.state.currentTxt.length == this.state.goalBlock.length &&
					<div className="continueWrapper">
						<a 
							className="button button-xlarge button-success button-inline"
							onClick={this.continueStory}>Continue</a>
					</div>
				}
			</div>
		)
	}
}