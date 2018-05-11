import * as React from 'react';
import * as Engine from '../engine';

export default class Options extends React.Component<{
	options: Engine.Option[];
	onSelect: (i: number) => void
}, {}> {
	constructor (props) {
		super(props);
	}
	render () {
		return (
			<div className="Options">{
				this.props.options.map((opt, i) => {
					return (
						<a 
							key={i}
							className="button button-xlarge button-inline button-primary"
							onClick={() => {
								this.props.onSelect(i)
							}}
						>
    						{opt.text}
						</a>
					)
				})}
			</div>
		)
	}
	submitOption = () => {
		const val = parseInt((document.querySelector('input[name="gameOpt"]:checked') as HTMLInputElement).value);
		this.props.onSelect(val)
	}
}